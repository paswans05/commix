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
    const model =
      configManager.getConfig<string>(ConfigKeys.NVIDIA_MODEL) ||
      'meta/llama-3.1-70b-instruct';
    const temperature = configManager.getConfig<number>(
      ConfigKeys.OPENAI_TEMPERATURE,
      0.7
    );

    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature
    });
    const duration = (Date.now() - startTime) / 1000;

    if (completion.usage) {
      Logger.log(
        `[NVIDIA] Model: ${model}, Tokens: ${completion.usage.total_tokens}, Time: ${duration}s`
      );
    }

    return completion.choices[0]?.message?.content || undefined;
  }
}
