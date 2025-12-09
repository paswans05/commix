import * as vscode from 'vscode';

/**
 * Adds progress handling functionality.
 */
export class ProgressHandler {
  static async withProgress<T>(
    title: string,
    task: (
      progress: vscode.Progress<{ message?: string; increment?: number }>
    ) => Promise<T>
  ): Promise<T> {
    return vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `[CommiX] ${title}`,
        cancellable: true
      },
      task
    );
  }
}

export class Logger {
  private static _outputChannel: vscode.OutputChannel;

  public static get outputChannel(): vscode.OutputChannel {
    if (!this._outputChannel) {
      this._outputChannel = vscode.window.createOutputChannel('CommiX');
    }
    return this._outputChannel;
  }

  public static log(message: string) {
    // Show the channel when logging
    // this.outputChannel.show(true);
    this.outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${message}`);
  }
}
