import * as vscode from 'vscode';

export async function aiWorkflow() {
  const workflowSteps = [
    { label: '$(edit) AI Edit / Refactor', id: 'commix.aiEdit' },
    { label: '$(output) Explain Code', id: 'commix.aiExplain' },
    { label: '$(sync) Convert Code', id: 'commix.aiConvert' },
    { label: '$(code) Generate Snippet', id: 'commix.aiSnippet' },
    { label: '$(beaker) Generate Test', id: 'commix.aiTest' },
    { label: '$(book) Generate Documentation', id: 'commix.aiDoc' }
  ];

  const selectedSteps = await vscode.window.showQuickPick(workflowSteps, {
    canPickMany: true,
    placeHolder: 'Select steps for your AI workflow (run in order)'
  });

  if (!selectedSteps || selectedSteps.length === 0) {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Executing AI Workflow...',
      cancellable: true
    },
    async (progress, token) => {
      for (let i = 0; i < selectedSteps.length; i++) {
        if (token.isCancellationRequested) {
          break;
        }

        const step = selectedSteps[i];
        progress.report({
          message: `Step ${i + 1}/${selectedSteps.length}: ${step.label}`,
          increment: (1 / selectedSteps.length) * 100
        });

        try {
          await vscode.commands.executeCommand(step.id);
        } catch (error: any) {
          vscode.window.showErrorMessage(
            `Workflow failed at step "${step.label}": ${error.message}`
          );
          break;
        }
      }
    }
  );
}
