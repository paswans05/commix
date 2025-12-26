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
    try {
      const gemini = this.createGeminiAPIClient();
      const configManager = ConfigurationManager.getInstance();
      const modelName =
        configManager.getConfig<string>(ConfigKeys.GEMINI_MODEL) || 'gemini-2.5-flash';
      const temperature = configManager.getConfig<number>(
        ConfigKeys.GEMINI_TEMPERATURE,
        0.7
      );

      const model = gemini.getGenerativeModel({ model: modelName });

      const promptParts = messages.map((msg) => msg.content as string);

      const requestOptions = {
        generationConfig: {
          temperature: temperature
        }
      };

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
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }
}
