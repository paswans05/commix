import * as vscode from 'vscode';
import { generateCommitMsg } from './generate-commit-msg';
import { ConfigurationManager } from './config';
import { aiEdit } from './ai-features/edit';
import { aiExplain } from './ai-features/explain';

/**
 * Manages the registration and disposal of commands.
 */
export class CommandManager {
  private disposables: vscode.Disposable[] = [];

  constructor(private context: vscode.ExtensionContext) {}

  registerCommands() {
    this.registerCommand('extension.commix', generateCommitMsg);
    this.registerCommand('extension.configure-commix', () =>
      vscode.commands.executeCommand('workbench.action.openSettings', 'commix')
    );

    // Show available OpenAI models
    this.registerCommand('commix.showAvailableModels', async () => {
      const configManager = ConfigurationManager.getInstance();
      const models = await configManager.getAvailableOpenAIModels();
      const selected = await vscode.window.showQuickPick(models, {
        placeHolder: 'Please select a model'
      });
      
      if (selected) {
        const config = vscode.workspace.getConfiguration('commix');
        await config.update('OPENAI_MODEL', selected, vscode.ConfigurationTarget.Global);
      }
    });

    this.registerCommand('commix.aiEdit', aiEdit);
    this.registerCommand('commix.aiExplain', aiExplain);
  
  }

  private registerCommand(command: string, handler: (...args: any[]) => any) {
    const disposable = vscode.commands.registerCommand(command, async (...args) => {
      try {
        await handler(...args);
      } catch (error) {
        const result = await vscode.window.showErrorMessage(
          `Failed: ${error.message}`,
          'Retry',
          'Configure'
        );

        if (result === 'Retry') {
          await handler(...args);
        } else if (result === 'Configure') {
          await vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'commix'
          );
        }
      }
    });

    this.disposables.push(disposable);
    this.context.subscriptions.push(disposable);
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }
}
