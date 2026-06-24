import * as vscode from 'vscode';
import OpenAI from 'openai';
import { createOpenAIApi } from './openai-utils';

/**
 * Configuration keys used in the CommiX extension.
 * @constant {Object}
 * @property {string} OPENAI_API_KEY - The key for OpenAI API.
 * @property {string} OPENAI_BASE_URL - The base URL for OpenAI API.
 * @property {string} OPENAI_MODEL - The model used for OpenAI.
 * @property {string} API_VERSION - The version of Azure API.
 * @property {string} AI_LANGUAGE - The language for CommiX messages.
 * @property {string} SYSTEM_PROMPT - The system prompt for generating commit messages.
 * @property {string} OPENAI_TEMPERATURE - The temperature setting for OpenAI API.
 * @property {string} NVIDIA_API_KEY - The key for NVIDIA API.
 * @property {string} NVIDIA_MODEL - The temperature setting for OpenAI API.
 */
export enum ConfigKeys {
  AI_LANGUAGE = 'AI_LANGUAGE',
  SYSTEM_PROMPT = 'SYSTEM_PROMPT',
  API_VERSION = 'API_VERSION',
  AI_PROVIDER = 'AI_PROVIDER',

  OPENAI_API_KEY = 'OPENAI_API_KEY',
  OPENAI_BASE_URL = 'OPENAI_BASE_URL',
  OPENAI_MODEL = 'OPENAI_MODEL',
  OPENAI_TEMPERATURE = 'OPENAI_TEMPERATURE',

  GEMINI_API_KEY = 'GEMINI_API_KEY',
  GEMINI_MODEL = 'GEMINI_MODEL',
  GEMINI_TEMPERATURE = 'GEMINI_TEMPERATURE',

  NVIDIA_API_KEY = 'NVIDIA_API_KEY',
  NVIDIA_MODEL = 'NVIDIA_MODEL',

  GROQ_API_KEY = 'GROQ_API_KEY',
  GROQ_MODEL = 'GROQ_MODEL',

  OLLAMA_BASE_URL = 'OLLAMA_BASE_URL',
  OLLAMA_MODEL = 'OLLAMA_MODEL',

  PROMPT_SNIPPET = 'PROMPT_SNIPPET',
  PROMPT_TEST = 'PROMPT_TEST',
  PROMPT_DOC = 'PROMPT_DOC',
  PROMPT_PRE_COMMIT_DOC = 'PROMPT_PRE_COMMIT_DOC'
}

/**
 * Manages the configuration for the CommiX extension.
 */
export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private configCache: Map<string, any> = new Map();
  private disposable: vscode.Disposable;
  private context: vscode.ExtensionContext;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.disposable = vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('commix')) {
        this.configCache.clear();

        if (
          event.affectsConfiguration('commix.OPENAI_BASE_URL') ||
          event.affectsConfiguration('commix.OPENAI_API_KEY')
        ) {
          this.updateOpenAIModelList();
        }

        if (event.affectsConfiguration('commix.NVIDIA_API_KEY')) {
          this.updateNvidiaModelList();
        }

        if (event.affectsConfiguration('commix.GEMINI_API_KEY')) {
          this.updateGeminiModelList();
        }
      }
    });
  }

  static getInstance(context?: vscode.ExtensionContext): ConfigurationManager {
    if (!this.instance && context) {
      this.instance = new ConfigurationManager(context);
    }
    return this.instance;
  }

  getConfig<T>(key: string, defaultValue?: T): T {
    if (!this.configCache.has(key)) {
      const config = vscode.workspace.getConfiguration('commix');
      this.configCache.set(key, config.get<T>(key, defaultValue));
    }
    return this.configCache.get(key);
  }

  dispose() {
    this.disposable.dispose();
  }

  /**
   * Updates the list of available OpenAI models.
   */
  private async updateOpenAIModelList() {
    try {
      const openai = createOpenAIApi();
      const models = await openai.models.list();

      // Save available models to extension state
      await this.context.globalState.update(
        'availableOpenAIModels',
        models.data.map((model) => model.id)
      );

      // Get the current selected model
      const config = vscode.workspace.getConfiguration('commix');
      const currentModel = config.get<string>('OPENAI_MODEL');

      // If the current selected model is not in the available list, set it to the default value
      const availableModels = models.data.map((model) => model.id);
      if (!availableModels.includes(currentModel)) {
        await config.update('OPENAI_MODEL', 'gpt-4', vscode.ConfigurationTarget.Global);
      }
    } catch (error) {
      console.error('Failed to fetch OpenAI models:', error);
    }
  }

  /**
   * Retrieves the list of available OpenAI models.
   * @returns {Promise<string[]>} The list of available OpenAI models.
   */
  public async getAvailableOpenAIModels(forceRefresh = false): Promise<string[]> {
    if (forceRefresh || !this.context.globalState.get<string[]>('availableOpenAIModels')) {
      await this.updateOpenAIModelList();
    }
    return this.context.globalState.get<string[]>('availableOpenAIModels', []);
  }

  /**
   * Updates the list of available NVIDIA models.
   */
  private async updateNvidiaModelList() {
    try {
      const apiKey = this.getConfig<string>(ConfigKeys.NVIDIA_API_KEY);
      if (!apiKey) {
        return;
      }
      const openai = new OpenAI({
        apiKey,
        baseURL: 'https://integrate.api.nvidia.com/v1'
      });
      const models = await openai.models.list();

      // Save available models to extension state
      await this.context.globalState.update(
        'availableNvidiaModels',
        models.data.map((model) => model.id)
      );

      // Get the current selected model
      const config = vscode.workspace.getConfiguration('commix');
      const currentModel = config.get<string>('NVIDIA_MODEL');

      // If the current selected model is not in the available list, set it to the default value
      const availableModels = models.data.map((model) => model.id);
      if (!availableModels.includes(currentModel)) {
        await config.update('NVIDIA_MODEL', 'meta/llama-3.3-70b-instruct', vscode.ConfigurationTarget.Global);
      }
    } catch (error) {
      console.error('Failed to fetch NVIDIA models:', error);
    }
  }

  /**
   * Retrieves the list of available NVIDIA models.
   * @returns {Promise<string[]>} The list of available NVIDIA models.
   */
  public async getAvailableNvidiaModels(forceRefresh = false): Promise<string[]> {
    if (forceRefresh || !this.context.globalState.get<string[]>('availableNvidiaModels')) {
      await this.updateNvidiaModelList();
    }
    return this.context.globalState.get<string[]>('availableNvidiaModels', []);
  }

  /**
   * Updates the list of available Gemini models.
   */
  private async updateGeminiModelList() {
    try {
      const apiKey = this.getConfig<string>(ConfigKeys.GEMINI_API_KEY);
      if (!apiKey) {
        return;
      }
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as {
        models: Array<{ name: string; supportedGenerationMethods: string[] }>;
      };
      
      // Filter models that support generateContent
      const availableModels = data.models
        .filter((model) => model.supportedGenerationMethods.includes('generateContent'))
        .map((model) => model.name.replace('models/', ''));

      // Save available models to extension state
      await this.context.globalState.update(
        'availableGeminiModels',
        availableModels
      );

      // Get the current selected model
      const config = vscode.workspace.getConfiguration('commix');
      const currentModel = config.get<string>('GEMINI_MODEL');

      // If the current selected model is not in the available list, set it to the default value
      if (!availableModels.includes(currentModel)) {
        await config.update('GEMINI_MODEL', 'gemini-2.5-flash', vscode.ConfigurationTarget.Global);
      }
    } catch (error) {
      console.error('Failed to fetch Gemini models:', error);
    }
  }

  /**
   * Retrieves the list of available Gemini models.
   * @returns {Promise<string[]>} The list of available Gemini models.
   */
  public async getAvailableGeminiModels(forceRefresh = false): Promise<string[]> {
    if (forceRefresh || !this.context.globalState.get<string[]>('availableGeminiModels')) {
      await this.updateGeminiModelList();
    }
    return this.context.globalState.get<string[]>('availableGeminiModels', []);
  }
}
