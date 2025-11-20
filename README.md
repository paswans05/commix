<a name="readme-top"></a>

<div align="center">

<img height="120" src="./assets/images/logo.png">

<h1>CommiX</h1>

AI-powered commit message generator for VS Code.  
CommiX reviews your Git changes and generates clean, conventional commit messages using OpenAI / Gemini / DeepSeek models — keeping your commits consistent and effortless.

**English** · [Report Bug](https://github.com/paswans05/commix/issues) · [Request Feature](https://github.com/paswans05/commix/issues)

<!-- Badges -->
![Contributors](https://img.shields.io/github/contributors/paswans05/commix?style=flat-square&labelColor=000)
![Forks](https://img.shields.io/github/forks/paswans05/commix?style=flat-square&labelColor=000)
![Stars](https://img.shields.io/github/stars/paswans05/commix?style=flat-square&labelColor=000)
![Issues](https://img.shields.io/github/issues/paswans05/commix?style=flat-square&labelColor=000)
![License](https://img.shields.io/github/license/paswans05/commix?style=flat-square&labelColor=000)

</div>

---

## ✨ Features

- ⚡ Generate commit messages automatically from git diff  
- 🤖 Supports OpenAI / Azure OpenAI / Gemini / DeepSeek APIs  
- 🌍 Supports multi-language commit messages  
- 😎 Optional Gitmoji support  
- 🛠️ Custom system prompt  
- 📏 Follows Conventional Commits specification  
- 🎨 Simple and fast UI inside the Source Control panel

---

## 📦 Installation

### From VS Code Marketplace  
Search for **“CommiX”** → Click **Install**

### Requirements  
- Node.js ≥ 16  

---

## 🤯 Usage

1. Install **CommiX** extension in VS Code  
2. Open **Settings → CommiX** → Configure your API key & model  
3. Stage your changes (`git add`)  
4. Click the **CommiX AI** button next to the commit message input  
5. CommiX generates a commit message and inserts it automatically  
6. Review & commit

> 💡 If the diff is too large, stage files in smaller batches.

---

## ⚙️ Configuration

These settings are available under:  
**VS Code → Settings → CommiX**

| Setting           | Type    | Default                | Required | Description |
|------------------|---------|------------------------|----------|-------------|
| `AI_PROVIDER`     | string  | `openai`               | Yes      | Choose: `openai`, `azure`, `gemini`, `deepseek` |
| `OPENAI_API_KEY`  | string  | —                      | Yes (if openai) | OpenAI API Key |
| `OPENAI_MODEL`    | string  | `gpt-4o`               | Yes      | Model used |
| `GEMINI_API_KEY`  | string  | —                      | Yes (if gemini) | Gemini API Key |
| `GEMINI_MODEL`    | string  | `gemini-2.0-flash-001` | Yes      | Gemini model |
| `TEMPERATURE`     | number  | `0.7`                  | No       | Controls creativity |
| `LANGUAGE`        | string  | `en`                   | Yes      | Commit message language |
| `SYSTEM_PROMPT`   | string  | —                      | No       | Custom system prompt |
| `ENABLE_GITMOJI`  | boolean | `false`                | No       | Enable Gitmoji |

---

## 🔧 Local Development

```bash
git clone https://github.com/paswans05/commix.git
cd commix
npm install
