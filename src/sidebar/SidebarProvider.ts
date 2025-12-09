import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'onInfo': {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case 'onError': {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>CommiX</title>
                <style>
                    :root {
                        --container-paddding: 20px;
                        --input-padding-vertical: 6px;
                        --input-padding-horizontal: 4px;
                        --input-margin-vertical: 4px;
                        --input-margin-horizontal: 0;
                    }

                    body {
                        font-family: var(--vscode-font-family);
                        padding: 0;
                        margin: 0;
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-sideBar-background);
                        display: flex;
                        flex-direction: column;
                        height: 100vh;
                        overflow: hidden;
                    }

                    .header {
                        padding: 20px;
                        background: linear-gradient(135deg, var(--vscode-button-background) 0%, var(--vscode-button-hoverBackground) 100%);
                        color: var(--vscode-button-foreground);
                        text-align: center;
                        border-bottom-left-radius: 20px;
                        border-bottom-right-radius: 20px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        margin-bottom: 20px;
                    }

                    .header h1 {
                        margin: 0;
                        font-size: 1.8rem;
                        font-weight: 800;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }
                    
                    .header p {
                        margin: 5px 0 0;
                        opacity: 0.9;
                        font-size: 0.85rem;
                    }

                    .content {
                        flex: 1;
                        padding: 0 15px;
                        overflow-y: auto;
                    }

                    .card {
                        background-color: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 15px;
                        transition: transform 0.2s, box-shadow 0.2s;
                    }

                    .card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        border-color: var(--vscode-focusBorder);
                    }

                    .card-title {
                        font-weight: 600;
                        margin-bottom: 8px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 1rem;
                    }

                    .card-desc {
                        font-size: 0.85rem;
                        color: var(--vscode-descriptionForeground);
                        margin-bottom: 12px;
                        line-height: 1.4;
                    }

                    .button {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 10px;
                        cursor: pointer;
                        width: 100%;
                        border-radius: 4px;
                        font-weight: 500;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                    }

                    .button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                        transform: scale(1.02);
                    }
                    
                    .button.secondary {
                        background-color: transparent;
                        border: 1px solid var(--vscode-button-background);
                        color: var(--vscode-foreground);
                    }
                    
                    .button.secondary:hover {
                        background-color: var(--vscode-button-secondaryHoverBackground);
                    }

                    .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 0.8rem;
                        color: var(--vscode-descriptionForeground);
                        border-top: 1px solid var(--vscode-widget-border);
                        background-color: var(--vscode-editor-background);
                    }
                    
                    .footer-links {
                        display: flex;
                        justify-content: center;
                        gap: 15px;
                        margin-bottom: 10px;
                    }
                    
                    .footer a {
                        color: var(--vscode-textLink-foreground);
                        text-decoration: none;
                    }
                    
                    .footer a:hover {
                        text-decoration: underline;
                    }
                    
                    .company-badge {
                        display: inline-block;
                        padding: 4px 8px;
                        background: var(--vscode-badge-background);
                        color: var(--vscode-badge-foreground);
                        border-radius: 12px;
                        font-size: 0.75rem;
                        margin-top: 8px;
                        font-weight: 600;
                    }

                    /* Animation */
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .card {
                        animation: slideIn 0.4s ease-out forwards;
                    }
                    
                    .card:nth-child(2) { animation-delay: 0.1s; }
                    .card:nth-child(3) { animation-delay: 0.2s; }

                </style>
			</head>
			<body>
				<div class="header">
                    <h1>CommiX</h1>
                    <p>AI-Powered Coding Assistant</p>
                </div>

                <div class="content">
                    <!-- Generate Commit Card -->
                    <div class="card">
                        <div class="card-title">🚀 Smart Commit</div>
                        <div class="card-desc">Generate conventional commit messages from your staged changes automatically.</div>
                        <button class="button" onclick="sendMessage('generate')">
                            Generate Commit
                        </button>
                    </div>

                    <!-- AI Edit Card -->
                    <div class="card">
                        <div class="card-title">✨ AI Edit</div>
                        <div class="card-desc">Refactor, fix, or optimize your code with natural language instructions.</div>
                        <button class="button secondary" onclick="sendMessage('edit')">
                            Start AI Edit
                        </button>
                    </div>

                    <!-- AI Explain Card -->
                    <div class="card">
                        <div class="card-title">🧠 AI Explain</div>
                        <div class="card-desc">Get instant explanations for complex logic or unfamiliar code blocks.</div>
                        <button class="button secondary" onclick="sendMessage('explain')">
                            Explain Code
                        </button>
                    </div>
                </div>

                <div class="footer">
                    <div class="footer-links">
                        <a href="https://github.com/paswans05/commix">GitHub</a> • 
                        <a href="https://github.com/paswans05/commix/issues">Support</a> • 
                        <a href="https://marketplace.visualstudio.com/items?itemName=paswans05.commix">Rate Us</a>
                    </div>
                    <div>Version 4.0.0</div>
                    <div class="company-badge">Paswans05 Open Source</div>
                    <p style="margin-top: 10px; opacity: 0.6;">Crafted with ❤️ for Developers</p>
                </div>
                
                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();
                    
                    function sendMessage(command) {
                        vscode.postMessage({
                            type: 'command',
                            value: command
                        });
                    }
                </script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
