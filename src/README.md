# 📦 CommiX Extension Source Code (`src`)

This directory contains the core source code for the **CommiX** VS Code extension. The extension is built using TypeScript, bunded with Webpack, and integrates Git status control with multiple AI models to provide commit message generation and advanced coding assistant tools.

## 📂 Subdirectory Architecture

* **[`ai-features/`](file:///d:/open-source/commix/src/ai-features/)**: Houses individual AI logic capabilities like Edit/Refactor, Code Explanation, Convert Code, Snippet & Document generation, Unit test creation, and Pre-Commit Document Prepare.
* **[`providers/`](file:///d:/open-source/commix/src/providers/)**: Wraps APIs and SDKs for different AI model platforms (OpenAI, Google Gemini, NVIDIA NIM, Groq, Ollama) and manages fallback/benchmarking.
* **[`sidebar/`](file:///d:/open-source/commix/src/sidebar/)**: Formats and controls the HTML/CSS webview container rendered in VS Code's sidebar activity bar.

---

## 📂 File Summary & Architecture

| File | Module / Responsibility | Description |
| :--- | :--- | :--- |
| [`extension.ts`](file:///d:/open-source/commix/src/extension.ts) | **Entry Point** | Initializes Configuration, Commands, Sidebar, CodeLens, and CodeAction Providers on activation. |
| [`commands.ts`](file:///d:/open-source/commix/src/commands.ts) | **Command Registry** | Defines and registers all VS Code command shortcuts (`commix.*`) and links them to their respective event handlers. |
| [`config.ts`](file:///d:/open-source/commix/src/config.ts) | **Configuration Manager** | Singleton managing workspace/global settings (API Keys, active models, temperatures, custom prompts). |
| [`generate-commit-msg.ts`](file:///d:/open-source/commix/src/generate-commit-msg.ts) | **Commit Message Engine** | Orchestrates fetching staged changes, processing context, querying the active AI provider, and inserting the result into the VS Code SCM Git commit input box. |
| [`git-utils.ts`](file:///d:/open-source/commix/src/git-utils.ts) | **Git Helpers** | Utility logic to execute Git CLI processes (like fetching staged diffs). |
| [`openai-utils.ts`](file:///d:/open-source/commix/src/openai-utils.ts) | **OpenAI Client Setup** | Helper methods to configure/authenticate the OpenAI API client. |
| [`prompts.ts`](file:///d:/open-source/commix/src/prompts.ts) | **System Prompts** | Stores default system prompts for the commit generator (supporting Emoji and Conventional Commits). |
| [`status-bar.ts`](file:///d:/open-source/commix/src/status-bar.ts) | **Status Bar Toggle** | Instantiates a status bar element showing `⚡ CommiX: ON` or `🚫 CommiX: OFF` with toggle capabilities. |
| [`utils.ts`](file:///d:/open-source/commix/src/utils.ts) | **Common Utilities** | Contains logging and loader spinner indicators for active operations. |
