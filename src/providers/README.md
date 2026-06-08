# 🔌 AI Providers (`src/providers`)

This directory contains the provider abstractions and concrete class implementations for the various AI backends supported by **CommiX**. It uses a factory pattern to dynamically select and invoke the configured provider at runtime.

## 📂 File Summary & Providers

| File | Provider / Utility | Description |
| :--- | :--- | :--- |
| [`base.ts`](file:///d:/open-source/commix/src/providers/base.ts) | **`AIProvider` Interface** | Defines the core contract for all providers, specifying the `generateCommitMessage` method. |
| [`factory.ts`](file:///d:/open-source/commix/src/providers/factory.ts) | **`ProviderFactory` Class** | Dynamically instantiates the correct provider instance (`OpenAIProvider`, `GeminiProvider`, etc.) based on the user's active configuration. |
| [`gemini.ts`](file:///d:/open-source/commix/src/providers/gemini.ts) | **Google Gemini Provider** | Implements connection to Google AI Studio APIs using `@google/generative-ai`. Includes built-in automatic model fallback logic (e.g., trying `gemini-2.5-flash` if `gemini-3-pro` fails with transient rate limits). |
| [`openai.ts`](file:///d:/open-source/commix/src/providers/openai.ts) | **OpenAI Provider** | Implements connections to OpenAI APIs (GPT-4o, GPT-4o-mini, etc.) using the official `openai` SDK. |
| [`groq.ts`](file:///d:/open-source/commix/src/providers/groq.ts) | **Groq Provider** | Implements connection to Groq API endpoints for fast-inference models. |
| [`nvidia.ts`](file:///d:/open-source/commix/src/providers/nvidia.ts) | **NVIDIA NIM Provider** | Implements support for NVIDIA's hosted models on the Build Platform. |
| [`ollama.ts`](file:///d:/open-source/commix/src/providers/ollama.ts) | **Ollama Provider (Local)** | Implements support for running local open-source models (e.g., Llama 3, Mistral) via a local Ollama server endpoint. |
