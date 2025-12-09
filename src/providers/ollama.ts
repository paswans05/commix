import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ConfigKeys, ConfigurationManager } from '../config';
import { AIProvider } from './base';
import * as http from 'http';
import { Logger } from '../utils';

export class OllamaProvider implements AIProvider {
  private getOllamaConfig() {
    const configManager = ConfigurationManager.getInstance();
    let baseURL =
      configManager.getConfig<string>(ConfigKeys.OLLAMA_BASE_URL) ||
      'http://localhost:11434';

    // Ensure base URL ends with /v1 for OpenAI compatibility if not present
    if (!baseURL.endsWith('/v1')) {
      baseURL = baseURL.replace(/\/+$/, '') + '/v1';
    }

    return {
      apiKey: 'ollama', // key is required but ignored
      baseURL
    };
  }

  private createOllamaApi() {
    const config = this.getOllamaConfig();
    return new OpenAI(config);
  }

  async generateCommitMessage(
    messages: ChatCompletionMessageParam[]
  ): Promise<string | undefined> {
    const openai = this.createOllamaApi();
    const configManager = ConfigurationManager.getInstance();
    const model = configManager.getConfig<string>(ConfigKeys.OLLAMA_MODEL) || 'llama3';
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
        `[Ollama] Model: ${model}, Tokens: ${completion.usage.total_tokens}, Time: ${duration}s`
      );
    }

    return completion.choices[0]?.message?.content || undefined;
  }

  static async isAvailable(): Promise<boolean> {
    const configManager = ConfigurationManager.getInstance();
    const baseURL =
      configManager.getConfig<string>(ConfigKeys.OLLAMA_BASE_URL) ||
      'http://localhost:11434';
    // Strip /v1 if present for health check
    const cleanUrl = baseURL.replace(/\/v1\/?$/, '');

    return new Promise((resolve) => {
      try {
        const url = new URL(cleanUrl);
        const req = http.request(
          {
            hostname: url.hostname,
            port: url.port,
            path: '/',
            method: 'GET',
            timeout: 500 // short timeout
          },
          (res) => {
            resolve(res.statusCode === 200);
          }
        );

        req.on('error', () => resolve(false));
        req.end();
      } catch {
        resolve(false);
      }
    });
  }
}
