import * as vscode from 'vscode';
import { ChatGPTAPI } from '../openai-utils';
import { GeminiAPI } from '../gemini-utils';
import { NvidiaAPI } from '../nvidia-utils';
import { ConfigKeys, ConfigurationManager } from '../config';
import { ChatCompletionMessageParam } from 'openai/resources';
import { DiffViewManager } from './diff-view';

export async function aiEdit(range?: vscode.Range) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const selection = range ? new vscode.Selection(range.start, range.end) : editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showErrorMessage('Please select some code to edit');
    return;
  }

  const quickPickItems = [
      { label: '$(sparkle) Custom Instruction', description: 'Enter your own instruction' },
      { label: '$(tools) Refactor', description: 'Refactor the code for better structure' },
      { label: '$(bug) Fix', description: 'Fix bugs in the code' },
      { label: '$(book) Document', description: 'Add documentation/comments' },
      { label: '$(rocket) Optimize', description: 'Optimize for performance' }
  ];

  const selectedAction = await vscode.window.showQuickPick(quickPickItems, {
      placeHolder: 'What would you like to do with this code?'
  });

  if (!selectedAction) {
      return;
  }

  let instruction = '';
  if (selectedAction.label.includes('Custom Instruction')) {
      const input = await vscode.window.showInputBox({
          prompt: 'Enter your instruction',
          placeHolder: 'e.g., Change variable names to snake_case'
      });
      if (!input) return;
      instruction = input;
  } else {
      instruction = selectedAction.description || selectedAction.label;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'CommiX: Editing Code...',
      cancellable: false
    },
    async () => {
      try {
        const configManager = ConfigurationManager.getInstance();
        const aiProvider = configManager.getConfig<string>(ConfigKeys.AI_PROVIDER, 'openai');
        
        const messages: ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content: 'You are an expert coding assistant. You will receive code and an instruction. You must output ONLY the modified code that satisfies the instruction. Do not wrap it in markdown code blocks unless requested. Do not add explanations.'
          },
          {
            role: 'user',
            content: `Code:\n${selectedText}\n\nInstruction:\n${instruction}`
          }
        ];

        let result: string | undefined;

        if (aiProvider === 'gemini') {
             result = await GeminiAPI(messages as any);
        } else if (aiProvider === 'nvidia') {
             result = await NvidiaAPI(messages);
        } else {
             result = await ChatGPTAPI(messages);
        }

        if (result) {
            const cleanResult = result.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
            
            // Use Diff View instead of direct edit
            const diffManager = DiffViewManager.getInstance();
            // We need a file extension for syntax highlighting in the diff view.
            // Try to get it from the current document.
            const languageId = editor.document.languageId === 'typescript' ? 'ts' : 
                               editor.document.languageId === 'javascript' ? 'js' : 
                               editor.document.languageId === 'python' ? 'py' : 'txt';

            await diffManager.openDiffView(selectedText, cleanResult, languageId);
            
            // Ask user if they want to apply the changes
            const apply = await vscode.window.showInformationMessage('Do you want to apply these changes?', 'Yes', 'No');
            if (apply === 'Yes') {
                 await editor.edit(editBuilder => {
                    editBuilder.replace(selection, cleanResult);
                });
            }
        }
      } catch (error) {
        vscode.window.showErrorMessage(`AI Edit failed: ${error}`);
      }
    }
  );
}
