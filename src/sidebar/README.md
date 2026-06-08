# 🗂️ CommiX Sidebar (`src/sidebar`)

This directory contains the user interface components that populate the CommiX custom Activity Bar sidebar view in VS Code.

## 📂 File Summary & UI Elements

| File | Component | Description |
| :--- | :--- | :--- |
| [`SidebarProvider.ts`](file:///d:/open-source/commix/src/sidebar/SidebarProvider.ts) | **Webview Sidebar View Provider** | Renders the HTML, CSS, and interactive JavaScript interfaces that display the CommiX Sidebar cards inside VS Code. It sets up message passing (`postMessage` / `onDidReceiveMessage`) to execute VS Code extension commands when users click buttons in the UI. |

## 🌟 Sidebar Features Offered

1. **🚀 Smart Commit**: Generate commit messages from current staged files with one click.
2. **📋 Document Prepare**: Generate markdown technical documentation based on all staged changes.
3. **✨ AI Edit**: Start inline AI refactoring.
4. **🧠 AI Explain**: Describe selected code block behavior.
5. **📝 Snippet & Docs**: Quick actions to write snippets or document code.
6. **🧪 Test Lab**: Create unit test files.
7. **⚡ AI Workflow**: Chain multiple actions sequentially.
8. **📦 Template System**: Save and insert custom templates.
