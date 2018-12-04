/**
 * Sample plugin which demonstrates webview plugin API.
 *
 *  // Create and show webview panel
 *  const panel = theia.window.createWebviewPanel('testId', 'Test',  theia.ViewColumn.One);
 *  panel.webview.html ='<html><head></head><body><h1>Test</h1></body></html>';
 */

import * as theia from '@theia/plugin';
import * as path from 'path';


const cats = {
    'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
    'Testing Cat': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
};

export function start(context: theia.PluginContext) {

    context.subscriptions.push(
        theia.commands.registerCommand({
            id: 'cat-coding-start',
            label: 'Cat coding - start'
        }, () => {
            CatCodingPanel.createOrShow(context.extensionPath);
        })
    );

    context.subscriptions.push(
        theia.commands.registerCommand({
            id: 'cat-coding-do-refactor',
            label: 'Cat coding - do refactor'
        }, () => {
            if (CatCodingPanel.currentPanel) {
                CatCodingPanel.currentPanel.doRefactor();
            }
        })
    );

    context.subscriptions.push(
        theia.commands.registerCommand({
            id: 'cat-coding-enable-scripts',
            label: 'Cat coding - enable scripts'
        }, () => {
            if (CatCodingPanel.currentPanel) {
                CatCodingPanel.currentPanel.setOptions({ enableScripts: true });
            }
        })
    );

    context.subscriptions.push(
        theia.commands.registerCommand({
            id: 'cat-coding-disable-scripts',
            label: 'Cat coding - disable scripts'
        }, () => {
            if (CatCodingPanel.currentPanel) {
                CatCodingPanel.currentPanel.setOptions({ enableScripts: false });
            }
        })
    );

    if (theia.window.registerWebviewPanelSerializer) {
        // Make sure we register a serilizer in activation event
        theia.window.registerWebviewPanelSerializer(CatCodingPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: theia.WebviewPanel, state: any) {
                console.log(`Got state: ${state}`);
                CatCodingPanel.revive(webviewPanel, context.extensionPath);
            }
        });
    }
}
/**
 * Manages cat coding webview panels
 */
class CatCodingPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: CatCodingPanel | undefined;

    public static readonly viewType = 'catCoding';

    private readonly _panel: theia.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: theia.Disposable[] = [];

    public static createOrShow(extensionPath: string) {
        const column = theia.window.activeTextEditor ? theia.window.activeTextEditor.viewColumn : undefined;
        // If we already have a panel, show it.
        if (CatCodingPanel.currentPanel) {
            CatCodingPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = theia.window.createWebviewPanel(CatCodingPanel.viewType, 'Cat Coding', column || theia.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,

            // And restric the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                theia.Uri.file(path.join(extensionPath, 'resources'))
            ]
        });

        // Local icon paths in the webview
        const lightIconUri = theia.Uri.file(path.join(extensionPath, 'resources', 'light', 'search.png'));
        const darkIconUri = theia.Uri.file(path.join(extensionPath, 'resources', 'dark', 'search.png'));
        panel.iconPath = { light: lightIconUri, dark: darkIconUri };

        CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath);
    }

    public static revive(panel: theia.WebviewPanel, extensionPath: string) {
        CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath);
    }

    private constructor(panel: theia.WebviewPanel,
        extensionPath: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update()
            }
        }, null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    theia.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }

    public setOptions(options: theia.WebviewOptions) {
        if (CatCodingPanel.currentPanel) {
            CatCodingPanel.currentPanel._panel.webview.options = options;
            return;
        }
    }

    public doRefactor() {
        // Send a message to the webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    }

    public dispose() {
        CatCodingPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        // Vary the webview's content based on where it is located in the editor.
        switch (this._panel.viewColumn) {
            case theia.ViewColumn.Two:
                this._updateForCat('Testing Cat');
                return;
            case theia.ViewColumn.Three:
                this._updateForCat('Compiling Cat');
                return;
            case theia.ViewColumn.One:
            default:
                this._updateForCat('Coding Cat');
                return;
        }
    }

    private _updateForCat(catName: keyof typeof cats) {
        this._panel.title = catName;
        this._panel.webview.html = this._getHtmlForWebview(cats[catName]);
    }

    private _getHtmlForWebview(catGif: string) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = theia.Uri.file(path.join(this._extensionPath, 'resources', 'main.js'));
        // And the uri we use to load this script in the webview
        const scriptUri = scriptPathOnDisk.with({ scheme: 'theia-resource' });
        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">

                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                scripts that have a specific nonce and only allow unsafe-inline for theme styles.
                -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src theia-resource: https:; script-src 'nonce-${nonce}';">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
            </head>
            <body style="background: var(--theia-menu-color0);">
                <img src="${catGif}" width="300" />
                <h1 id="lines-of-code-counter" style="color: var(--theia-ui-bar-font-color1);">0</h1>

                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


export function stop() {

}
