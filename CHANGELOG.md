# Changelog
All notable changes to **CommiX** will be documented in this file.

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
