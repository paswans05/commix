# Changelog
All notable changes to **CommiX** will be documented in this file.

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
