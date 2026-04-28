import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ConfigKeys, ConfigurationManager } from '../config';
import { AIProvider } from './base';
import { Logger } from '../utils';

const DEFAULT_NVIDIA_MODEL = 'meta/llama-3.1-70b-instruct';

const SUPPORTED_NVIDIA_CHAT_MODELS = new Set([
  'deepseek-ai/deepseek-v4-flash',
  'meta/llama-3.1-70b-instruct',
  'meta/llama-3.1-8b-instruct',
  'meta/llama-3.3-70b-instruct',
  'meta/llama-4-maverick-17b-128e-instruct',
  'microsoft/phi-4-mini-instruct',
  'minimaxai/minimax-m2.5',
  'mistralai/mistral-nemotron',
  'mistralai/mistral-small-4-119b-2603',
  'moonshotai/kimi-k2-instruct',
  'moonshotai/kimi-k2-instruct-0905',
  'nvidia/nemotron-3-nano-30b-a3b',
  'nvidia/nemotron-3-super-120b-a12b',
  'nvidia/nemotron-mini-4b-instruct',
  'nvidia/nemotron-nano-12b-v2-vl',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen2.5-coder-32b-instruct',
  'qwen/qwen3-coder-480b-a35b-instruct',
  'qwen/qwen3-next-80b-a3b-instruct',
  'qwen/qwen3.5-122b-a10b',
  'stepfun-ai/step-3.5-flash'
]);

const NVIDIA_MODEL_ALIASES: Record<string, string> = {
  'gemma-3-27b-it': 'nvidia/nemotron-mini-4b-instruct',
  'google/gemma-2-9b-it': 'nvidia/nemotron-mini-4b-instruct',
  'google/gemma-3-27b-it': 'nvidia/nemotron-mini-4b-instruct',
  'gpt-oss-120b': 'openai/gpt-oss-120b',
  'gpt-oss-20b': 'openai/gpt-oss-20b',
  'kimi-k2-instruct': 'moonshotai/kimi-k2-instruct',
  'kimi-k2-instruct-0905': 'moonshotai/kimi-k2-instruct-0905',
  'llama-3.1-8b-instruct': 'meta/llama-3.1-8b-instruct',
  'llama-3.3-70b-instruct': 'meta/llama-3.3-70b-instruct',
  'llama-4-maverick-17b-128e-instruct':
    'meta/llama-4-maverick-17b-128e-instruct',
  'microsoft/phi-3.5-mini-instruct': 'microsoft/phi-4-mini-instruct',
  'minimax-m2.5': 'minimaxai/minimax-m2.5',
  'mistral-nemotron': 'mistralai/mistral-nemotron',
  'mistral-small-4-119b-2603': 'mistralai/mistral-small-4-119b-2603',
  'nemotron-3-nano-30b-a3b': 'nvidia/nemotron-3-nano-30b-a3b',
  'nemotron-3-super-120b-a12b': 'nvidia/nemotron-3-super-120b-a12b',
  'nemotron-nano-12b-v2-vl': 'nvidia/nemotron-nano-12b-v2-vl',
  'qwen2.5-7b-instruct': 'qwen/qwen2.5-coder-32b-instruct',
  'qwen2.5-72b-instruct': 'qwen/qwen3-coder-480b-a35b-instruct',
  'qwen3-next-80b-a3b-instruct': 'qwen/qwen3-next-80b-a3b-instruct',
  'qwen3.5-122b-a10b': 'qwen/qwen3.5-122b-a10b',
  'step-3.5-flash': 'stepfun-ai/step-3.5-flash',
  'deepseek-r1': 'deepseek-ai/deepseek-v4-flash',
  'deepseek-coder-v2-lite': 'deepseek-ai/deepseek-v4-flash',
  'deepseek-ai/deepseek-r1-distill-qwen-32b': 'deepseek-ai/deepseek-v4-flash',
  'deepseek-ai/deepseek-v3.1': 'deepseek-ai/deepseek-v4-flash',
  'nvidia/llava-llama3-8b': DEFAULT_NVIDIA_MODEL,
  'nvidia/nv-embedqa-e5-v5': DEFAULT_NVIDIA_MODEL
};

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

  private resolveChatModel(model: string): string {
    const normalizedModel = NVIDIA_MODEL_ALIASES[model] || model;

    if (normalizedModel !== model) {
      Logger.log(`[NVIDIA] Model "${model}" mapped to "${normalizedModel}".`);
    }

    if (SUPPORTED_NVIDIA_CHAT_MODELS.has(normalizedModel)) {
      return normalizedModel;
    }

    Logger.log(
      `[NVIDIA] Unsupported chat model "${model}". Falling back to "${DEFAULT_NVIDIA_MODEL}".`
    );
    return DEFAULT_NVIDIA_MODEL;
  }

  async generateCommitMessage(
    messages: ChatCompletionMessageParam[]
  ): Promise<string | undefined> {
    const openai = this.createNvidiaApi();
    const configManager = ConfigurationManager.getInstance();
    const configuredModel =
      configManager.getConfig<string>(ConfigKeys.NVIDIA_MODEL) ||
      DEFAULT_NVIDIA_MODEL;
    const model = this.resolveChatModel(configuredModel);
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
