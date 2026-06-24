import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ConfigKeys, ConfigurationManager } from '../config';
import { AIProvider } from './base';
import { Logger } from '../utils';

export class NvidiaProvider implements AIProvider {
  private getNvidiaConfig() {
    const configManager = ConfigurationManager.getInstance();
    const apiKey = configManager.getConfig<string>(ConfigKeys.NVIDIA_API_KEY);
    const baseURL = 'https://integrate.api.nvidia.com/v1';

    if (!apiKey) {
      throw new Error('The NVIDIA_API_KEY environment variable is missing or empty.');
    }

    return {
      apiKey,
      baseURL
    };
  }

  private createNvidiaApi() {
    const config = this.getNvidiaConfig();
    return new OpenAI(config);
  }

  async generateCommitMessage(
    messages: ChatCompletionMessageParam[]
  ): Promise<string | undefined> {
    const openai = this.createNvidiaApi();
    const configManager = ConfigurationManager.getInstance();
    const originalModelName =
      configManager.getConfig<string>(ConfigKeys.NVIDIA_MODEL) ||
      'meta/llama-3.2-3b-instruct';
    const temperature = configManager.getConfig<number>(
      ConfigKeys.OPENAI_TEMPERATURE,
      0.7
    );

    const fallbackModels = [
      'meta/llama-3.2-3b-instruct',
      'meta/llama-3.3-70b-instruct',
      'google/gemma-2-2b-it'
    ];

    const modelsToTry = [originalModelName];
    for (const model of fallbackModels) {
      if (!modelsToTry.includes(model)) {
        modelsToTry.push(model);
      }
    }

    let lastError: any;
    for (const modelName of modelsToTry) {
      try {
        const startTime = Date.now();
        const completion = await openai.chat.completions.create({
          model: modelName,
          messages,
          temperature
        });
        const duration = (Date.now() - startTime) / 1000;

        if (completion.usage) {
          Logger.log(
            `[NVIDIA] Model: ${modelName}, Tokens: ${completion.usage.total_tokens}, Time: ${duration}s`
          );
        } else {
          Logger.log(
            `[NVIDIA] Model: ${modelName}, Time: ${duration}s (Usage data unavailable)`
          );
        }

        return completion.choices[0]?.message?.content || undefined;
      } catch (error: any) {
        lastError = error;
        Logger.log(`[NVIDIA] Model ${modelName} failed: ${error.message || error}`);

        // Check if error is 404 (model not found) or other typical transient API errors
        const isTransientError =
          error.status === 404 ||
          error.status === 429 ||
          error.status === 500 ||
          error.status === 502 ||
          error.status === 503 ||
          error.status === 504 ||
          error.message?.includes('404') ||
          error.message?.includes('429') ||
          error.message?.includes('500') ||
          error.message?.includes('502') ||
          error.message?.includes('503') ||
          error.message?.includes('504') ||
          error.message?.toLowerCase().includes('quota') ||
          error.message?.toLowerCase().includes('limit') ||
          error.message?.toLowerCase().includes('exhausted') ||
          error.message?.toLowerCase().includes('service unavailable') ||
          error.message?.toLowerCase().includes('high demand') ||
          error.message?.toLowerCase().includes('not found') ||
          error.message?.toLowerCase().includes('server error');

        if (!isTransientError) {
          // If it's a fatal authorization or invalid key error, don't try other models
          throw error;
        }
      }
    }

    throw lastError || new Error('Failed to generate message using NVIDIA provider');
  }
}
