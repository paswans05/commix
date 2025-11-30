import * as vscode from 'vscode';
import { CommandManager } from './commands';
import { ConfigurationManager } from './config';
import { SidebarProvider } from './sidebar/SidebarProvider';
import { StatusBarManager } from './status-bar';

/**
 * Activates the extension and registers commands.
 *
 * @param {vscode.ExtensionContext} context - The context for the extension.
 */
export async function activate(context: vscode.ExtensionContext) {
  try {
    const configManager = ConfigurationManager.getInstance(context);

    const commandManager = new CommandManager(context);
    commandManager.registerCommands();

    const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        "commix.sidebarView",
        sidebarProvider
      )
    );

    const statusBarManager = new StatusBarManager(context);

    context.subscriptions.push({
      dispose: () => {
        configManager.dispose();
        commandManager.dispose();
      }
    });

    const apiOpenAIKey = configManager.getConfig<string>('OPENAI_API_KEY');
    const apiGeminiKey = configManager.getConfig<string>('GEMINI_API_KEY');
    const apiNvidiaKey = configManager.getConfig<string>('NVIDIA_API_KEY');

    // Show message only if BOTH keys are empty
    if (!apiOpenAIKey && !apiGeminiKey && !apiNvidiaKey) {
      const result = await vscode.window.showWarningMessage(
        'No API keys configured (OpenAI, Gemini and Nvidia). Would you like to configure them now?',
        'Yes',
        'No'
      );

      if (result === 'Yes') {
        await vscode.commands.executeCommand(
          'workbench.action.openSettings',
          'commix'
        );
      }
    }
  } catch (error) {
    console.error('Failed to activate extension:', error);
    throw error;
  }
}

/**
 * Deactivates the extension.
 * This function is called when the extension is deactivated.
 */
export function deactivate() {}
