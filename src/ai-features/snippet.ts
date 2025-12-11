import * as vscode from 'vscode';
import { ProviderFactory } from '../providers/factory';
import { ChatCompletionMessageParam } from 'openai/resources';

export async function aiSnippet() {
  try {
    // Prompt user for snippet description
    const description = await vscode.window.showInputBox({
      prompt: 'Describe the code snippet you want to generate',
      placeHolder: 'e.g., "function to debounce a click event"',
      ignoreFocusOut: true
    });

    if (!description) {
      return;
    }

    // Get active editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    // Get language context
    const languageId = editor.document.languageId;

    // Build messages for AI provider
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a code snippet generator. Generate clean, production-ready code snippets based on user descriptions. Only return the code, no explanations or markdown formatting.`
      },
      {
        role: 'user',
        content: `Generate a ${languageId} code snippet: ${description}`
      }
    ];

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Generating snippet...',
        cancellable: false
      },
      async () => {
        try {
          const provider = ProviderFactory.getProvider();
          const snippet = await provider.generateCommitMessage(messages);

          if (snippet) {
            // Insert at cursor position
            const position = editor.selection.active;
            await editor.edit((editBuilder) => {
              editBuilder.insert(position, snippet);
            });
            vscode.window.showInformationMessage('Snippet generated successfully!');
          }
        } catch (error: any) {
          vscode.window.showErrorMessage(
            `Failed to generate snippet: ${error.message}`
          );
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}
