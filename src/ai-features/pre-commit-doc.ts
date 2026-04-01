import * as vscode from 'vscode';
import { ProviderFactory } from '../providers/factory';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ConfigKeys, ConfigurationManager } from '../config';
import { getRepo } from '../generate-commit-msg';
import { getDiffStaged } from '../git-utils';

export async function preCommitDoc(arg?: any) {
  try {
    const repo = await getRepo(arg);
    const { diff, error } = await getDiffStaged(repo);

    if (error) {
      throw new Error(`Failed to get staged changes: ${error}`);
    }

    if (!diff || diff === 'No changes staged.') {
      vscode.window.showWarningMessage(
        'No changes staged. Please stage your files before generating documentation.'
      );
      return;
    }

    const configManager = ConfigurationManager.getInstance();
    const customPrompt = configManager.getConfig<string>(ConfigKeys.PROMPT_PRE_COMMIT_DOC);

    // Build messages for AI provider
    const systemPrompt =
      customPrompt ||
      `You are a senior software engineer and technical documentation expert.

Given a git diff of staged changes, generate **Technical Documentation** in clean Markdown format.

The documentation should cover:

## 1. Summary
A brief overview of the changes — what was added, modified, or removed and why.

## 2. Files Changed
A table listing each file with:
| Action | File | Description |
| ------ | ---- | ----------- |

## 3. Technical Details
For each changed file or logical group of changes, explain:
- **What was changed** — the specific functions, classes, components, or configurations modified
- **How it works** — the logic, data flow, and architecture behind the changes
- **Dependencies** — any new imports, packages, or external services introduced
- **API Changes** — new or modified endpoints, request/response shapes, query params

## 4. Architecture & Design Decisions
Explain any important design decisions, patterns used (e.g., factory pattern, observer, etc.), and why they were chosen.

## 5. Configuration Changes
Document any new settings, environment variables, feature flags, or configuration options added.

## 6. Migration Notes
If applicable, note any database migrations, breaking changes, or upgrade steps.

## 7. Usage Examples
Provide code snippets or usage examples showing how the new/changed functionality is used.

---
RULES:
1. Output ONLY the markdown documentation
2. Be specific — reference actual file names, function names, variables, and types from the diff
3. Use proper markdown formatting with code blocks, tables, and headers
4. Write professional, clear, and concise documentation
5. Focus on TECHNICAL details, not process or checklists
6. Skip sections that are not relevant to the changes`;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Generate technical documentation for the following staged changes:\n\n${diff}`
      }
    ];

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Generating Technical Documentation...',
        cancellable: false
      },
      async () => {
        try {
          const provider = ProviderFactory.getProvider();
          const documentation = await provider.generateCommitMessage(messages);

          if (documentation) {
            const doc = await vscode.workspace.openTextDocument({
              content: documentation,
              language: 'markdown'
            });
            await vscode.window.showTextDocument(doc, {
              preview: false,
              viewColumn: vscode.ViewColumn.Beside
            });
            vscode.window.showInformationMessage(
              'Technical Documentation generated successfully!'
            );
          }
        } catch (error: any) {
          vscode.window.showErrorMessage(
            `Failed to generate documentation: ${error.message}`
          );
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}
