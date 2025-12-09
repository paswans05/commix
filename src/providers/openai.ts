import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ConfigKeys, ConfigurationManager } from '../config';
import { AIProvider } from './base';
import { Logger } from '../utils';

export class OpenAIProvider implements AIProvider {
  private getOpenAIConfig() {
    const configManager = ConfigurationManager.getInstance();
    const apiKey = configManager.getConfig<string>(ConfigKeys.OPENAI_API_KEY);
    const baseURL = configManager.getConfig<string>(ConfigKeys.OPENAI_BASE_URL);
    const apiVersion = configManager.getConfig<string>(ConfigKeys.API_VERSION);

    if (!apiKey) {
      throw new Error('The OPENAI_API_KEY environment variable is missing or empty.');
    }

    const config: {
      apiKey: string;
      baseURL?: string;
      defaultQuery?: { 'api-version': string };
      defaultHeaders?: { 'api-key': string };
    } = {
      apiKey
    };

    if (baseURL) {
      config.baseURL = baseURL;
      if (apiVersion) {
        config.defaultQuery = { 'api-version': apiVersion };
        config.defaultHeaders = { 'api-key': apiKey };
      }
    }

    return config;
  }

  private createOpenAIApi() {
    const config = this.getOpenAIConfig();
    return new OpenAI(config);
  }

  async generateCommitMessage(
    messages: ChatCompletionMessageParam[]
  ): Promise<string | undefined> {
    const openai = this.createOpenAIApi();
    const configManager = ConfigurationManager.getInstance();
    const model = configManager.getConfig<string>(ConfigKeys.OPENAI_MODEL) || 'gpt-4o';
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
        `[OpenAI] Model: ${model}, Tokens: ${completion.usage.total_tokens}, Time: ${duration}s`
      );
    }

    return completion.choices[0]!.message?.content || undefined;
  }
}
