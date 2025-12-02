import * as vscode from 'vscode';

/**
 * Provides code actions for the "AI Edit" and "AI Explain" features.
 */
export class AIActionProvider implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.Refactor,
		vscode.CodeActionKind.QuickFix
	];

	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
		// Only provide actions if there is a selection or if the cursor is on a word
		if (range.isEmpty && !document.getWordRangeAtPosition(range.start)) {
			return [];
		}

		const actions: vscode.CodeAction[] = [];

		// AI Edit Action
		const editAction = new vscode.CodeAction('CommiX: AI Edit / Refactor', vscode.CodeActionKind.RefactorRewrite);
		editAction.command = {
			command: 'commix.aiEdit',
			title: 'CommiX: AI Edit / Refactor',
			arguments: [range] // Pass the range to the command
		};
		actions.push(editAction);

		// AI Explain Action
		const explainAction = new vscode.CodeAction('CommiX: Explain Code', vscode.CodeActionKind.QuickFix);
		explainAction.command = {
			command: 'commix.aiExplain',
			title: 'CommiX: Explain Code',
			arguments: [range]
		};
		actions.push(explainAction);

        // Convert Code Action
        const convertAction = new vscode.CodeAction('CommiX: Convert Code', vscode.CodeActionKind.RefactorRewrite);
        convertAction.command = {
            command: 'commix.aiConvert',
            title: 'CommiX: Convert Code',
            arguments: [range]
        };
        actions.push(convertAction);

		return actions;
	}
}
