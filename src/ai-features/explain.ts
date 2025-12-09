import * as vscode from 'vscode';

import { ConfigKeys, ConfigurationManager } from '../config';
import { ChatCompletionMessageParam } from 'openai/resources';

export async function aiExplain() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showErrorMessage('Please select some code to explain');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'CommiX: Explaining Code...',
      cancellable: false
    },
    async () => {
      try {
        const configManager = ConfigurationManager.getInstance();
        const aiProvider = configManager.getConfig<string>(
          ConfigKeys.AI_PROVIDER,
          'openai'
        );

        const messages: ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content:
              'You are an expert coding assistant. Explain the following code clearly and concisely.'
          },
          {
            role: 'user',
            content: selectedText
          }
        ];

        let result: string | undefined;

        const { ProviderFactory } = await import('../providers/factory');
        const provider = ProviderFactory.getProvider();
        result = await provider.generateCommitMessage(messages);

        if (result) {
          // Show in a new output channel or sidebar
          // For MVP, let's use an output channel
          const channel = vscode.window.createOutputChannel('CommiX Explanation');
          channel.clear();
          channel.append(result);
          channel.show();
        }
      } catch (error) {
        vscode.window.showErrorMessage(`AI Explain failed: ${error}`);
      }
    }
  );
}
