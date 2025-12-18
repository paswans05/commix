import * as vscode from 'vscode';
import { ProviderFactory } from '../providers/factory';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ConfigKeys, ConfigurationManager } from '../config';

export async function aiDoc() {
  try {
    // Get active editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    // Get selected text or entire file
    const selection = editor.selection;
    const selectedText = editor.document.getText(
      selection.isEmpty ? undefined : selection
    );

    if (!selectedText.trim()) {
      vscode.window.showErrorMessage('No code selected or file is empty');
      return;
    }

    // Get language context
    const languageId = editor.document.languageId;
    const fileName = editor.document.fileName.split(/[\\/]/).pop() || 'code';

    // Ask for additional context
    const extraContext = await vscode.window.showInputBox({
      prompt: 'Any additional context? (optional)',
      placeHolder: 'e.g., "include usage examples", "focus on API endpoints"',
      ignoreFocusOut: true
    });

    const configManager = ConfigurationManager.getInstance();
    const customPrompt = configManager.getConfig<string>(ConfigKeys.PROMPT_DOC);

    // Build messages for AI provider
    const systemPrompt =
      customPrompt ||
      `You are a technical documentation expert. Generate comprehensive, well-structured markdown documentation for the provided code. Include:
- Overview/Purpose
- Parameters/Arguments
- Return values
- Usage examples
- Important notes or warnings
Format as clean markdown.`;

    const userPrompt = extraContext
      ? `Generate documentation for this ${languageId} code. Additional context: ${extraContext}\n\nCode:\n${selectedText}`
      : `Generate documentation for this ${languageId} code:\n\n${selectedText}`;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Generating documentation...',
        cancellable: false
      },
      async () => {
        try {
          const provider = ProviderFactory.getProvider();
          const documentation = await provider.generateCommitMessage(messages);

          if (documentation) {
            // Open in new markdown editor
            const docFileName = fileName.replace(/\.[^.]+$/, '.md');
            const doc = await vscode.workspace.openTextDocument({
              content: documentation,
              language: 'markdown'
            });
            await vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage(
              'Documentation generated successfully!'
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
