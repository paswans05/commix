# 🤖 AI Features (`src/ai-features`)

This directory houses the core AI-powered coding features of **CommiX**. These modules interact with AI model APIs (via the registered providers) to perform actions on active document selections, functions, or staged files.

## 📂 File Summary & Features

| File | Feature / Responsibility | Detailed Description |
| :--- | :--- | :--- |
| [`code-actions.ts`](file:///d:/open-source/commix/src/ai-features/code-actions.ts) | **Code Actions Provider** | Exposes lightbulb suggestions (💡 Quick Fixes & Refactoring) when code is selected in the editor, providing fast shortcuts to *AI Edit*, *AI Explain*, and *Convert Code*. |
| [`codelens.ts`](file:///d:/open-source/commix/src/ai-features/codelens.ts) | **CodeLens Provider** | Inserts inline context buttons (`$(edit) AI Edit` and `$(output) AI Explain`) directly above functions, classes, and method definitions for one-click access. |
| [`convert.ts`](file:///d:/open-source/commix/src/ai-features/convert.ts) | **Convert Code** | Translates selected code blocks from one programming language to another (e.g., JavaScript to TypeScript, Python to Go). |
| [`diff-view.ts`](file:///d:/open-source/commix/src/ai-features/diff-view.ts) | **Diff View Utility** | Handles launching VS Code's side-by-side diff workspace, allowing users to review AI transformations safely before applying them. |
| [`doc-generator.ts`](file:///d:/open-source/commix/src/ai-features/doc-generator.ts) | **AI Doc Generator** | Automatically generates clean inline JSDoc, Docstrings, or technical comment blocks for functions. |
| [`edit.ts`](file:///d:/open-source/commix/src/ai-features/edit.ts) | **AI Edit & Refactor** | Modifies the active code selection according to natural language prompts (e.g., *"Make this function async"*, *"Optimize loops"*). Supports Diff preview. |
| [`explain.ts`](file:///d:/open-source/commix/src/ai-features/explain.ts) | **AI Explain Code** | Analyzes the selected code block and generates structured natural language explanations of how it works and what it does. |
| [`pre-commit-doc.ts`](file:///d:/open-source/commix/src/ai-features/pre-commit-doc.ts) | **Document Prepare** | Inspects all staged git changes (`git diff`) and generates comprehensive technical markdown documentation describing the changes, architectural decisions, and setup. |
| [`snippet.ts`](file:///d:/open-source/commix/src/ai-features/snippet.ts) | **AI Snippet Generator** | Generates small, reusable code snippets from plain-text descriptions. |
| [`templates.ts`](file:///d:/open-source/commix/src/ai-features/templates.ts) | **Template System** | Saves custom code blocks to workspace template files inside `.commix/templates/` and lets users insert them into their active editor on-demand. |
| [`test-generator.ts`](file:///d:/open-source/commix/src/ai-features/test-generator.ts) | **AI Test Lab** | Automatically drafts unit tests for selected functions with extensive edge case coverage. |
| [`workflow.ts`](file:///d:/open-source/commix/src/ai-features/workflow.ts) | **AI Workflow Builder** | Allows users to chain multiple AI actions in a pipeline sequence (e.g., Refactor -> Document -> Test) to automate code development. |
