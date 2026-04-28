# Changelog

All notable changes to **CommiX** will be documented in this file.

---

## [6.1.1] - 2026-04-29

- [FIX] Updated NVIDIA chat model IDs and added fallback validation for unsupported NVIDIA models.
- [FIX] Added live-verified NVIDIA NIM chat models from the local API list PDF.

---

## [5.2.0] - 2026-04-01

### 🚀 New Feature: Document Prepare

- **📋 Document Prepare**: Generate AI-powered technical documentation from your staged git changes — before you commit.
- Analyzes the staged diff and produces a structured Markdown document covering summary, files changed, technical details, architecture decisions, configuration changes, and usage examples.
- Accessible from:
  - **Source Control title bar** (icon button alongside Commit)
  - **CommiX Sidebar** ("Prepare Document" button)
  - **Command Palette** → `CommiX: $(book) Document Prepare`

### ✨ Added

- Added `commix.preCommitDoc` command for Document Prepare.
- Added `PROMPT_PRE_COMMIT_DOC` setting for custom system prompt override.
- Added Document Prepare button to the SCM title bar navigation.
- Added "📋 Document Prepare" card to the CommiX Sidebar.
- Uses `ProviderFactory` — works with all providers (OpenAI, Gemini, NVIDIA, Groq, Ollama).

---

## [4.0.0] - 2025-12-09

### 🚀 Major Features (Phase 4 Model Engine Upgrade)

- **Groq Support**: Added support for fast inference using Groq API.
- **Local Ollama Support**: Run models locally with Ollama (auto-detects local instance).
- **Benchmarking**: Added token usage and generation time logging ("CommiX" output channel).
- **Modular Providers**: Refactored Model Engine for better stability and easier addition of new providers.

---

## [5.1.3] - 2026-01-12

### ✨ Added

- **Gemini 3 Support**: Added `gemini-3-pro` and `gemini-3-flash` models.
- **Quota Fallback Logic**: Automatically falls back to alternative models (e.g., `gemini-2.5-flash`) if the primary Gemini model hits a rate limit (429 Error).

---

### ✨ Added

- Added `groq` to AI Providers.
- Added `ollama` to AI Providers.
- Added settings for Groq/Ollama models and keys/URLs.

---

## [3.0.0] - 2025-12-02

### 🚀 Major Features (Phase 3 AI Edit Mode)

- **Function-level Icons (CodeLens)**: "AI Edit" and "AI Explain" buttons now appear directly above functions and classes for quick access.
- **Inline Transformation Suggestions**: Lightbulb code actions for "AI Edit", "Explain Code", and "Convert Code".
- **Convert Code Command**: Easily convert code between languages (e.g., JS to TS, Python to Go) using `CommiX: Convert Code`.
- **Diff-based Preview**: AI edits now open in a diff view, allowing you to review changes before applying them.
- **Smart Patch Apply**: Apply changes from the diff view with a single click.
- **Enhanced AI Edit**: Added quick options for "Improve", "Fix", "Refactor", and "Document" when using AI Edit.

### ✨ Added

- Added `commix.enableCodeLens` setting to toggle function-level icons.
- Added `commix.aiConvert` command.
- Added `CodeActionProvider` for inline suggestions.
- Added `DiffViewManager` for handling AI suggestions safely.

---

## [2.0.0] - 2025-11-30

### 🚀 Major Features (Phase 2 Core)

- **AI Edit & Refactor**: Modify code with natural language instructions (`CommiX: AI Edit / Refactor`).
- **AI Explain Code**: Get instant explanations for selected code (`CommiX: Explain Code`).
- **CommiX Sidebar**: New dedicated view in the Activity Bar.
- **Status Bar Integration**: Toggle CommiX on/off directly from the status bar.
- **Editor Context Menu**: Access AI features via right-click on selected text.

### ✨ Added

- Added `$(edit)` icon to AI Edit command.
- Added `$(output)` icon to AI Explain command.
- Added `editor/title` menu support for quick access (currently disabled/reverted based on user preference).

---

## [1.0.0] - 2025-11-21

### ✨ Added

- Added **NVIDIA NIM** provider support
- Added **DeepSeek** model support
- Added **Qwen** model support
- Added model descriptions using `enumDescriptions`
- Added new recommended models for each provider
- Added multi-language commit generation
- Added custom system prompt setting
- Added Gitmoji support
- Added AI provider switch: `openai`, `gemini`, `nvidia`

### 🛠 Improved

- Enhanced commit message accuracy and context understanding
- Improved diff processing performance
- Faster extension activation
- Better type safety across provider integrations
- Improved error handling for missing API keys
- Updated README with more complete installation and setup instructions
- More stable message formatting to avoid TS errors

### 🐛 Fixed

- Fixed issue: message type mismatch (`ChatCompletionMessageParam`)
- Fixed incorrect schema defaults for NVIDIA models
- Fixed diff truncation on very large repos
- Fixed settings validation for unsupported models
- Fixed config manager not returning correct key in some environments

---

## [0.0.3] - 2025-11-12

### 🎉 Initial Release

- AI-powered commit message generator
- Supports OpenAI + Google Gemini
- Git diff → AI commit message pipeline
- VS Code UI integration
- Conventional Commit formatting
- Multi-language commit output
- Gitmoji toggle
- Simple provider settings
