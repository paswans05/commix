import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function saveTemplate() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(
    selection.isEmpty ? undefined : selection
  );

  if (!selectedText.trim()) {
    vscode.window.showErrorMessage('No text selected to save as template');
    return;
  }

  const templateName = await vscode.window.showInputBox({
    prompt: 'Enter a name for this template',
    placeHolder: 'e.g., "React Component", "Jest Test Scaffold"',
    ignoreFocusOut: true
  });

  if (!templateName) {
    return;
  }

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const templatesDir = path.join(workspaceFolder.uri.fsPath, '.commix', 'templates');
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  const templatePath = path.join(
    templatesDir,
    `${templateName.replace(/\s+/g, '_').toLowerCase()}.txt`
  );

  try {
    fs.writeFileSync(templatePath, selectedText);
    vscode.window.showInformationMessage(
      `Template "${templateName}" saved to .commix/templates`
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to save template: ${error.message}`);
  }
}

export async function insertTemplate() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const templatesDir = path.join(workspaceFolder.uri.fsPath, '.commix', 'templates');
  if (!fs.existsSync(templatesDir)) {
    vscode.window.showErrorMessage('No templates found in .commix/templates');
    return;
  }

  const files = fs.readdirSync(templatesDir).filter((file) => file.endsWith('.txt'));
  if (files.length === 0) {
    vscode.window.showErrorMessage('No templates found in .commix/templates');
    return;
  }

  const selectedFile = await vscode.window.showQuickPick(files, {
    placeHolder: 'Select a template to insert'
  });

  if (!selectedFile) {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  try {
    const templateContent = fs.readFileSync(
      path.join(templatesDir, selectedFile),
      'utf8'
    );
    const position = editor.selection.active;

    await editor.edit((editBuilder) => {
      editBuilder.insert(position, templateContent);
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to insert template: ${error.message}`);
  }
}
