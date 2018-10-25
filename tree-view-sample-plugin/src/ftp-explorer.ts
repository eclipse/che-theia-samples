/**
 * FTP Explorer. Sample of usage Tree View plugin API for Theia.
 *
 * This file is reworked copy of
 * https://github.com/Microsoft/vscode-extension-samples/blob/master/tree-view-sample/src/ftpExplorer.textDocumentContentProvider.ts
 */

import * as theia from '@theia/plugin';

import * as Client from 'ftp';
import { basename, dirname } from 'path';

export interface FtpNode {
    resource: theia.Uri;
    isDirectory: boolean;
}

export class FtpModel {

    constructor(readonly host: string, private user: string, private password: string) {
    }

    public connect(): Promise<Client> {
        return new Promise((c, e) => {
            const client = new Client();
            client.on('ready', () => {
                c(client);
            });

            client.on('error', error => {
                e('Error while connecting: ' + error.message);
            })

            client.connect({
                host: this.host,
                user: this.user,
                password: this.password
            });
        });
    }

    public get roots(): Promise<FtpNode[]> {
        return this.connect().then(client => {
            return new Promise<FtpNode[]>((c, e) => {
                client.list((err, list) => {
                    if (err) {
                        return e(err);
                    }

                    client.end();

                    return c(this.sort(list.map(entry => ({ resource: theia.Uri.parse(`ftp://${this.host}///${entry.name}`), isDirectory: entry.type === 'd' }))));
                });
            });
        });
    }

    public getChildren(node: FtpNode): Promise<FtpNode[]> {
        return this.connect().then(client => {
            return new Promise<FtpNode[]>((c, e) => {
                client.list(node.resource.fsPath, (err, list) => {
                    if (err) {
                        return e(err);
                    }

                    client.end();

                    return c(this.sort(list.map(entry => ({ resource: theia.Uri.parse(`${node.resource.fsPath}/${entry.name}`), isDirectory: entry.type === 'd' }))));
                });
            });
        });
    }

    private sort(nodes: FtpNode[]): FtpNode[] {
        return nodes.sort((n1, n2) => {
            if (n1.isDirectory && !n2.isDirectory) {
                return -1;
            }

            if (!n1.isDirectory && n2.isDirectory) {
                return 1;
            }

            return basename(n1.resource.fsPath).localeCompare(basename(n2.resource.fsPath));
        });
    }

    public getContent(resource: theia.Uri): Promise<string> {
        return this.connect().then(client => {
            return new Promise<string>((c, e) => {
                client.get(resource.path.substr(2), (err, stream) => {
                    if (err) {
                        return e(err);
                    }

                    let string = ''
                    stream.on('data', function(buffer) {
                        if (buffer) {
                            var part = buffer.toString();
                            string += part;
                        }
                    });

                    stream.on('end', function() {
                        client.end();
                        c(string);
                    });
                });
            });
        });
    }

}

// Implement theia.TextDocumentContentProvider intreface and uncomment provideTextDocumentContent
export class FtpTreeDataProvider implements theia.TreeDataProvider<FtpNode> {

    private _onDidChangeTreeData: theia.EventEmitter<any> = new theia.EventEmitter<any>();
    readonly onDidChangeTreeData: theia.Event<any> = this._onDidChangeTreeData.event;

    constructor(private readonly model: FtpModel) { }

    public refresh(): any {
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: FtpNode): theia.TreeItem {
        return {
            resourceUri: element.resource,
            collapsibleState: element.isDirectory ? theia.TreeItemCollapsibleState.Collapsed : void 0,
            iconPath: element.isDirectory ? 'fa-folder medium-yellow' : 'fa-file light-green',
            command: element.isDirectory ? undefined : {
                id: ftpExplorerOpenFtpResource.id,
                label: ftpExplorerOpenFtpResource.label,
                arguments: [element.resource]
            },
        };
    }

    public getChildren(element?: FtpNode): FtpNode[] | Promise<FtpNode[]> {
        return element ? this.model.getChildren(element) : this.model.roots;
    }

    public getParent(element: FtpNode): theia.ProviderResult<FtpNode> {
        const parent = element.resource.with({ path: dirname(element.resource.path) });

        return parent.path !== '//' ? {
            resource: parent,
            isDirectory: true
        } as FtpNode : undefined;

    }

    // public provideTextDocumentContent(uri: theia.Uri, token: theia.CancellationToken): theia.ProviderResult<string> {
    //     return this.model.getContent(uri).then(content => content);
    // }
}

const ftpExplorerRefresh: theia.Command = {
    id: 'ftpExplorer.refresh',
    label: 'FTP: Refresh'
};

const ftpExplorerOpenFtpResource: theia.Command = {
    id: 'ftpExplorer.openFtpResource',
    label: 'FTP: Open Resource'
};

const ftpExplorerRevealResource: theia.Command = {
    id: 'ftpExplorer.revealResource',
    label: 'FTP: Reveal in View'
};

export class FtpExplorer {

    private ftpViewer: theia.TreeView<FtpNode>;

    public ftpModel: FtpModel;

    constructor() {
        this.ftpModel = new FtpModel('mirror.switch.ch', 'anonymous', 'anonymous@anonymous.de');
        const treeDataProvider = new FtpTreeDataProvider(this.ftpModel);
        // theia.workspace.registerTextDocumentContentProvider('ftp', treeDataProvider)

        this.ftpViewer = theia.window.createTreeView('ftpExplorer', { treeDataProvider });

        theia.commands.registerCommand(ftpExplorerRefresh, () => treeDataProvider.refresh());
        theia.commands.registerCommand(ftpExplorerOpenFtpResource, resource => this.openResource(resource));
        theia.commands.registerCommand(ftpExplorerRevealResource, () => this.reveal());
    }

    private openResource(resource: theia.Uri): void {
        theia.workspace.openTextDocument(resource);
    }

    private async reveal(): Promise<void> {
        const node = this.getNode();
        if (node) {
            return await this.ftpViewer.reveal(node);
        }

        return undefined;
    }

    private getNode(): FtpNode | undefined {
        if (theia.window.activeTextEditor) {
            if (theia.window.activeTextEditor.document.uri.scheme === 'ftp') {
                return { resource: theia.window.activeTextEditor.document.uri, isDirectory: false };
            }
        }

        return undefined;
    }
}
