
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

const openedUri = new Set<theia.Uri>();
// let tree: theia.TreeView<theia.Uri>;
let treeDataProvider: OpenedEditorsDataProvider;

export function start(context: theia.PluginContext) {
    treeDataProvider = new OpenedEditorsDataProvider();
    theia.window.createTreeView('editors-tree', { treeDataProvider: treeDataProvider });

    theia.workspace.onDidOpenTextDocument(e => {
        openedUri.add(e.uri);
        updateEditorList();
    });

    theia.workspace.onDidCloseTextDocument(e => {
        openedUri.delete(e.uri);
        updateEditorList();
    });
}

function updateEditorList() {
treeDataProvider.sendDataChanged();
}

export class OpenedEditorsDataProvider implements theia.TreeDataProvider<theia.Uri> {

   // onDidChangeTreeData?: theia.Event<theia.Uri | null | undefined> | undefined;

    private onDidChangeTreeDataEmitter: theia.EventEmitter<any> = new theia.EventEmitter<any>();
    readonly onDidChangeTreeData: theia.Event<any> = this.onDidChangeTreeDataEmitter.event;

    public sendDataChanged() {
        this.onDidChangeTreeDataEmitter.fire();
    }

    getTreeItem(element: theia.Uri): theia.TreeItem | PromiseLike<theia.TreeItem> {
        return {
            label: element.path,
            iconPath: 'fa-sticky-note medium-red'
        };
    }

    getChildren(element?: theia.Uri | undefined): theia.ProviderResult<theia.Uri[]> {
        return [...openedUri];
    }
}

export function stop() {

}
