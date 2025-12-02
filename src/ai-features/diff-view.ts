import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

export class DiffViewManager {
    private static instance: DiffViewManager;
    private tempDir: string;

    private constructor() {
        this.tempDir = path.join(os.tmpdir(), 'commix-diffs');
        fs.ensureDirSync(this.tempDir);
    }

    public static getInstance(): DiffViewManager {
        if (!DiffViewManager.instance) {
            DiffViewManager.instance = new DiffViewManager();
        }
        return DiffViewManager.instance;
    }

    public async openDiffView(originalContent: string, modifiedContent: string, languageId: string): Promise<void> {
        const timestamp = Date.now();
        const originalUri = vscode.Uri.file(path.join(this.tempDir, `original_${timestamp}.${languageId}`));
        const modifiedUri = vscode.Uri.file(path.join(this.tempDir, `modified_${timestamp}.${languageId}`));

        await fs.writeFile(originalUri.fsPath, originalContent);
        await fs.writeFile(modifiedUri.fsPath, modifiedContent);

        await vscode.commands.executeCommand('vscode.diff', originalUri, modifiedUri, 'CommiX Diff: Original vs AI Suggestion');
    }
    
    public async cleanup() {
        try {
            await fs.remove(this.tempDir);
        } catch (error) {
            console.error('Failed to cleanup temp dir:', error);
        }
    }
}
