import * as vscode from 'vscode';
import { ChatGPTAPI } from '../openai-utils';
import { GeminiAPI } from '../gemini-utils';
import { NvidiaAPI } from '../nvidia-utils';
import { ConfigKeys, ConfigurationManager } from '../config';
import { ChatCompletionMessageParam } from 'openai/resources';

export async function aiEdit() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showErrorMessage('Please select some code to edit');
    return;
  }

  const instruction = await vscode.window.showInputBox({
    prompt: 'What would you like to do with this code?',
    placeHolder: 'e.g., Refactor to use async/await, Add comments, Optimize loop...'
  });

  if (!instruction) {
    return;
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
             // Gemini implementation might need adjustment for message format if it differs significantly
             // For now assuming similar structure or using the utils
             result = await GeminiAPI(messages as any);
        } else if (aiProvider === 'nvidia') {
             result = await NvidiaAPI(messages);
        } else {
             result = await ChatGPTAPI(messages);
        }

        if (result) {
            // Strip markdown code blocks if present
            const cleanResult = result.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
            
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, cleanResult);
            });
        }
      } catch (error) {
        vscode.window.showErrorMessage(`AI Edit failed: ${error}`);
      }
    }
  );
}
