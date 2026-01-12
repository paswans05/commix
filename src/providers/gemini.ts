import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigKeys, ConfigurationManager } from '../config';
import { AIProvider } from './base';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Logger } from '../utils';

export class GeminiProvider implements AIProvider {
  private getGeminiConfig() {
    const configManager = ConfigurationManager.getInstance();
    const apiKey = configManager.getConfig<string>(ConfigKeys.GEMINI_API_KEY);

    if (!apiKey) {
      throw new Error('The GEMINI_API_KEY environment variable is missing or empty.');
    }

    return { apiKey };
  }

  private createGeminiAPIClient() {
    const config = this.getGeminiConfig();
    return new GoogleGenerativeAI(config.apiKey);
  }

  async generateCommitMessage(
    messages: ChatCompletionMessageParam[]
  ): Promise<string | undefined> {
    const configManager = ConfigurationManager.getInstance();
    const originalModelName =
      configManager.getConfig<string>(ConfigKeys.GEMINI_MODEL) || 'gemini-2.5-flash';
    const temperature = configManager.getConfig<number>(
      ConfigKeys.GEMINI_TEMPERATURE,
      0.7
    );

    // List of fallback models to try in order
    // We start with the configured model, then try backups if it fails with quota issues
    const fallbackModels = [
      'gemini-3-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];

    // Ensure the user's selected model is tried first
    const modelsToTry = [originalModelName];

    // Add unique fallback models that aren't the original model
    for (const model of fallbackModels) {
      if (!modelsToTry.includes(model)) {
        modelsToTry.push(model);
      }
    }

    const promptParts = messages.map((msg) => msg.content as string);
    const requestOptions = {
      generationConfig: {
        temperature: temperature
      }
    };

    let lastError: any;

    for (const modelName of modelsToTry) {
      try {
        const gemini = this.createGeminiAPIClient();
        const model = gemini.getGenerativeModel({ model: modelName });

        const startTime = Date.now();
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: promptParts.map((p) => ({ text: p })) }],
          generationConfig: requestOptions.generationConfig
        });

        const response = result.response;
        const duration = (Date.now() - startTime) / 1000;

        if (response.usageMetadata) {
          Logger.log(
            `[Gemini] Model: ${modelName}, Tokens: ${response.usageMetadata.totalTokenCount}, Time: ${duration}s`
          );
        } else {
          Logger.log(
            `[Gemini] Model: ${modelName}, Time: ${duration}s (Usage data unavailable)`
          );
        }

        return response.text();
      } catch (error: any) {
        lastError = error;

        // potential 429 errors or quota errors
        const isQuotaError =
          error.message?.includes('429') ||
          error.status === 429 ||
          error.message?.includes('Quota exceeded');

        if (isQuotaError) {
          console.warn(
            `[Gemini] Model ${modelName} hit quota limit. Trying next model...`
          );
          Logger.log(
            `[Gemini] Warning: Model ${modelName} hit quota limit. Falling back...`
          );
          continue; // Try next model
        }

        // If it's not a quota error, rethrow immediately (e.g. auth error, bad request)
        console.error(`Gemini API call failed with model ${modelName}:`, error);
        throw error;
      }
    }

    // If we exhausted all models
    console.error('All Gemini models failed. Last error:', lastError);
    throw lastError;
  }
}
