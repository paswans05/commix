import * as vscode from 'vscode';

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private isEnabled: boolean = true;

  constructor(context: vscode.ExtensionContext) {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'commix.toggleStatus';
    context.subscriptions.push(this.statusBarItem);

    this.updateStatusBar();
    this.statusBarItem.show();

    context.subscriptions.push(
      vscode.commands.registerCommand('commix.toggleStatus', () => {
        this.toggle();
      })
    );
  }

  private toggle() {
    this.isEnabled = !this.isEnabled;
    this.updateStatusBar();
    vscode.window.showInformationMessage(
      `CommiX is now ${this.isEnabled ? 'Enabled' : 'Disabled'}`
    );
  }

  private updateStatusBar() {
    if (this.isEnabled) {
      this.statusBarItem.text = '$(zap) CommiX: ON';
      this.statusBarItem.tooltip = 'CommiX is active. Click to disable.';
      this.statusBarItem.color = undefined; // Default color
    } else {
      this.statusBarItem.text = '$(circle-slash) CommiX: OFF';
      this.statusBarItem.tooltip = 'CommiX is disabled. Click to enable.';
      this.statusBarItem.color = new vscode.ThemeColor('errorForeground');
    }
  }

  public getEnabledState(): boolean {
    return this.isEnabled;
  }
}
