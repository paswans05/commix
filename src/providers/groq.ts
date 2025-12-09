import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ConfigKeys, ConfigurationManager } from '../config';
import { AIProvider } from './base';
import { Logger } from '../utils';

export class GroqProvider implements AIProvider {
  private getGroqConfig() {
    const configManager = ConfigurationManager.getInstance();
    const apiKey = configManager.getConfig<string>(ConfigKeys.GROQ_API_KEY);
    const baseURL = 'https://api.groq.com/openai/v1';

    if (!apiKey) {
      throw new Error('The GROQ_API_KEY environment variable is missing or empty.');
    }

    return {
      apiKey,
      baseURL
    };
  }

  private createGroqApi() {
    const config = this.getGroqConfig();
    return new OpenAI(config);
  }

  async generateCommitMessage(
    messages: ChatCompletionMessageParam[]
  ): Promise<string | undefined> {
    const openai = this.createGroqApi();
    const configManager = ConfigurationManager.getInstance();
    const model =
      configManager.getConfig<string>(ConfigKeys.GROQ_MODEL) || 'llama3-70b-8192';
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
        `[Groq] Model: ${model}, Tokens: ${completion.usage.total_tokens}, Time: ${duration}s`
      );
    }

    return completion.choices[0]?.message?.content || undefined;
  }
}
