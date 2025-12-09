import * as vscode from 'vscode';

import { ConfigKeys, ConfigurationManager } from '../config';
import { ChatCompletionMessageParam } from 'openai/resources';

export async function aiConvert(range?: vscode.Range) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const selection = range
    ? new vscode.Selection(range.start, range.end)
    : editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showErrorMessage('Please select some code to convert');
    return;
  }

  const languages = [
    'TypeScript',
    'JavaScript',
    'Python',
    'Java',
    'C#',
    'C++',
    'Go',
    'Rust',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin'
  ];

  const targetLanguage = await vscode.window.showQuickPick(languages, {
    placeHolder: 'Select target language'
  });

  if (!targetLanguage) {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `CommiX: Converting to ${targetLanguage}...`,
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
            content: `You are an expert coding assistant. Convert the following code to ${targetLanguage}. Output ONLY the converted code. Do not wrap it in markdown code blocks unless requested. Do not add explanations.`
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
          const cleanResult = result.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');

          // Open a new untitled document with the converted code
          const doc = await vscode.workspace.openTextDocument({
            content: cleanResult,
            language: targetLanguage.toLowerCase()
          });
          await vscode.window.showTextDocument(doc);
        }
      } catch (error) {
        vscode.window.showErrorMessage(`AI Convert failed: ${error}`);
      }
    }
  );
}
