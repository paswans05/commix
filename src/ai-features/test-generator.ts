import * as vscode from 'vscode';
import { ProviderFactory } from '../providers/factory';
import { ChatCompletionMessageParam } from 'openai/resources';

export async function aiTest() {
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

    // Determine test framework based on language
    let testFramework = 'appropriate testing framework';
    if (languageId === 'typescript' || languageId === 'javascript') {
      testFramework = 'Jest';
    } else if (languageId === 'python') {
      testFramework = 'pytest';
    } else if (languageId === 'java') {
      testFramework = 'JUnit';
    }

    // Build messages for AI provider
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a test generation expert. Generate comprehensive unit tests using ${testFramework}. Include edge cases and proper assertions. Only return the test code, no explanations.`
      },
      {
        role: 'user',
        content: `Generate unit tests for this ${languageId} code:\n\n${selectedText}`
      }
    ];

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Generating tests...',
        cancellable: false
      },
      async () => {
        try {
          const provider = ProviderFactory.getProvider();
          const testCode = await provider.generateCommitMessage(messages);

          if (testCode) {
            // Open in new untitled editor
            const doc = await vscode.workspace.openTextDocument({
              content: testCode,
              language: languageId
            });
            await vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage('Tests generated successfully!');
          }
        } catch (error: any) {
          vscode.window.showErrorMessage(`Failed to generate tests: ${error.message}`);
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}
