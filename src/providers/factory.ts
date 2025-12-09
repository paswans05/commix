import { ConfigKeys, ConfigurationManager } from '../config';
import { AIProvider } from './base';
import { OpenAIProvider } from './openai';
import { GeminiProvider } from './gemini';
import { NvidiaProvider } from './nvidia';
import { GroqProvider } from './groq';
import { OllamaProvider } from './ollama';

export class ProviderFactory {
  static getProvider(): AIProvider {
    const configManager = ConfigurationManager.getInstance();
    const providerName = configManager.getConfig<string>(
      ConfigKeys.AI_PROVIDER,
      'openai'
    );

    switch (providerName) {
      case 'gemini':
        return new GeminiProvider();
      case 'nvidia':
        return new NvidiaProvider();
      case 'groq':
        return new GroqProvider();
      case 'ollama':
        return new OllamaProvider();
      case 'openai':
      default:
        return new OpenAIProvider();
    }
  }
}
