<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://github.com/paswans05/commix/blob/main/assets/images/logo.png?raw=true">

<h1>CommiX</h1>

AI-powered commit message generator & coding assistant for VS Code.  
CommiX reviews your Git changes and generates clean, conventional commit messages.  
**Now with v2.0 & v3.0**: Empower your workflow with **AI Edit**, **Refactor**, **Explain**, and **Convert** tools, featuring **CodeLens**, **Inline Suggestions**, and **Diff-based Previews** — all powered by OpenAI, Gemini, and NVIDIA.

**English** · [Report Bug](https://github.com/paswans05/commix/issues) · [Request Feature](https://github.com/paswans05/commix/issues)

<!-- Badges -->

![Contributors](https://img.shields.io/github/contributors/paswans05/commix?style=flat-square&labelColor=000)
![Forks](https://img.shields.io/github/forks/paswans05/commix?style=flat-square&labelColor=000)
![Stars](https://img.shields.io/github/stars/paswans05/commix?style=flat-square&labelColor=000)
![Issues](https://img.shields.io/github/issues/paswans05/commix?style=flat-square&labelColor=000)
![License](https://img.shields.io/github/license/paswans05/commix?style=flat-square&labelColor=000)

![CommiX](https://github.com/paswans05/commix/blob/main/assets/gif/commix-details.gif?raw=true)

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
- 📋 **Document Prepare**: Generate technical documentation from staged changes before committing
- 📊 **Benchmarking**: View token usage and generation time in the "CommiX" output channel

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

## 🛠️ AI Edit & Refactor

CommiX now supports **AI-powered code editing and refactoring**.

1. Select the code you want to modify in the editor.
2. Right-click and choose **"CommiX: $(edit) AI Edit / Refactor"**.
3. Enter your instruction (e.g., _"Refactor this function to be async"_, _"Add error handling"_, _"Optimize for performance"_).
4. CommiX will process your request and update the code automatically.

---

### 🚀 New in v3.0: AI Edit Mode

CommiX v3.0 introduces a powerful set of AI editing tools:

- **Function-level Icons (CodeLens)**: "AI Edit" and "AI Explain" buttons appear directly above functions/classes.
- **Inline Suggestions**: Click the lightbulb 💡 icon on selected code to access AI actions.
- **Convert Code**: Easily convert code between languages (e.g., JS → TS) via `CommiX: Convert Code`.
- **Diff-based Preview**: All AI edits now open in a **Diff View**, letting you review changes safely before applying.
- **Smart Patch**: Apply AI suggestions with a single click from the diff view.

---

## 📋 Document Prepare

CommiX can generate **technical documentation** from your staged changes — before you commit.

1. Stage your changes (`git add`)
2. Click the **"📋 Document Prepare"** button in the **Source Control title bar** or **CommiX Sidebar**
3. Or run from Command Palette: **"CommiX: $(book) Document Prepare"**
4. CommiX analyzes your diff and generates a Markdown document covering:
   - **Summary** of changes
   - **Files changed** table
   - **Technical details** — functions, classes, logic, data flow
   - **Architecture & design decisions**
   - **Configuration changes**
   - **Usage examples**
5. The documentation opens in a new editor tab for review

> 💡 You can customize the prompt via **Settings → CommiX → PROMPT_PRE_COMMIT_DOC**

---

## ⚙️ Configuration

These settings are available under:  
**VS Code → Settings → CommiX**

| Setting          | Type    | Default                       | Required        | Description                          |
| ---------------- | ------- | ----------------------------- | --------------- | ------------------------------------ |
| `AI_PROVIDER`    | string  | `openai`                      | Yes             | Choose: `openai`, `gemini`, `nvidia` |
| `OPENAI_API_KEY` | string  | —                             | Yes (if openai) | OpenAI API Key                       |
| `OPENAI_MODEL`   | string  | `gpt-4o`                      | Yes             | Model used                           |
| `GEMINI_API_KEY` | string  | —                             | Yes (if gemini) | Gemini API Key                       |
| `GEMINI_MODEL`   | string  | `gemini-2.0-flash-001`        | Yes             | Gemini model                         |
| `TEMPERATURE`    | number  | `0.7`                         | No              | Controls creativity                  |
| `LANGUAGE`       | string  | `en`                          | Yes             | Commit message language              |
| `SYSTEM_PROMPT`  | string  | —                             | No              | Custom system prompt                 |
| `ENABLE_GITMOJI` | boolean | `false`                       | No              | Enable Gitmoji                       |
| `NVIDIA_API_KEY` | string  | —                             | Yes (if nvidia) | NVIDIA API Key                       |
| `NVIDIA_MODEL`   | string  | `meta/llama-3.1-70b-instruct` | Yes             | Model used                           |

---

## 📘 API Key Setup Guide — CommiX

CommiX works with **OpenAI**, **Google Gemini**, and **NVIDIA NIM**.  
Follow this guide to generate API keys for each provider.

---

## 🟦 1. OpenAI API Key

**Steps:**

1. Open the OpenAI API dashboard:  
   👉 https://platform.openai.com/account/api-keys
2. Sign in to your OpenAI account
3. Click **“Create new secret key”**
4. Copy the key
5. In VS Code:  
   **Settings → CommiX → OpenAI API Key**

**Recommended Models:**

- `gpt-4o`
- `gpt-4o-mini`
- `o3-mini`
- `o1`

---

## 🟩 2. Google Gemini API Key

**Steps:**

1. Visit Google AI Studio:  
   👉 https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **“Create API Key”**
4. Copy the key
5. In VS Code:  
   **Settings → CommiX → Gemini API Key**

**Recommended Models:**

- `gemini-2.0-flash-001`
- `gemini-1.5-flash`
- `gemini-1.5-pro`

---

## 🟧 3. NVIDIA NIM API Key

**Steps:**

1. Go to NVIDIA Build Platform:  
   👉 https://build.nvidia.com
2. Sign in using your NVIDIA or Google account
3. Click **API Keys** in the left sidebar
4. Press **“Create Key”**
5. Copy the key
6. In VS Code:  
   **Settings → CommiX → NVIDIA API Key**

**Recommended Models:**

- `meta/llama-3.1-70b-instruct`
- `meta/llama-3.1-8b-instruct`
- `google/gemma-2-9b-it`
- `deepseek-r1`
- `deepseek-coder-v2-lite`

---

## 🟧 4. Groq API Key

**Steps:**

1. Go to Groq Cloud Console:
   👉 https://console.groq.com/keys
2. Sign in
3. Create an API Key
4. Copy the key
5. In VS Code:
   **Settings → CommiX → Groq API Key**

**Recommended Models:**

- `llama3-70b-8192`
- `mixtral-8x7b-32768`

---

## 🦙 5. Local Ollama

**Steps:**

1. Install Ollama:
   👉 https://ollama.com
2. Run a model (e.g., `ollama run llama3`)
3. In VS Code:
   **Settings → CommiX → AI Provider → ollama**
4. (Optional) Set `OLLAMA_BASE_URL` if not using default `http://localhost:11434`

**Recommended Models:**

- `llama3`
- `mistral`
- `phi`

---

## 🔒 Security Tips

- Never commit your API keys to GitHub
- Use environment variables or VS Code settings only
- Rotate keys if exposed
- Enable billing only when required

---

## 📌 Need help?

Open an issue:  
👉 https://github.com/paswans05/commix/issues
