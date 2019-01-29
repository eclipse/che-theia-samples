import * as theia from '@theia/plugin';

// here we store the list of editors
const openedEditors = new Set<theia.Uri>();

// data provider for tree view
let openedEditorsDataProvider: OpenedEditorsDataProvider;

export function start(context: theia.PluginContext) {
    // create the data provider
    openedEditorsDataProvider = new OpenedEditorsDataProvider();

    // create tree view
    let treeView: theia.TreeView<theia.Uri> = theia.window.createTreeView('opened-editors', { treeDataProvider: openedEditorsDataProvider });

    // display opened editor in the tree view
    theia.workspace.onDidOpenTextDocument(e => {
        openedEditors.add(e.uri);
        openedEditorsDataProvider.notifyDataChanged();
    });

    // remove opened editor from the tree view
    theia.workspace.onDidCloseTextDocument(e => {
        openedEditors.delete(e.uri);
        openedEditorsDataProvider.notifyDataChanged();
    });

    // highlight active editor in tree view
    theia.window.onDidChangeActiveTextEditor(e => {
        if (e) {
            treeView.reveal(e.document.uri, {
                select: true
            });
        }
    });
}

export function stop() {
}

/**
 * Data provider for opened editors tree view
 */
export class OpenedEditorsDataProvider implements theia.TreeDataProvider<theia.Uri> {

    // emitter and event to notify Theia that tree has been changed
    private onDidChangeTreeDataEmitter: theia.EventEmitter<any> = new theia.EventEmitter<any>();
    readonly onDidChangeTreeData: theia.Event<any> = this.onDidChangeTreeDataEmitter.event;

    // send data changed event to Theia
    public notifyDataChanged() {
        this.onDidChangeTreeDataEmitter.fire();
    }

    // creates TreeItem for given Uri
    getTreeItem(element: theia.Uri): theia.TreeItem | PromiseLike<theia.TreeItem> {
        let name = element.path.substring(element.path.lastIndexOf('/') + 1);
        return {
            label: name,
            iconPath: 'fa-sticky-note medium-red',
            tooltip: element.path
        };
    }

    // returns the list of opened editors
    getChildren(element?: theia.Uri | undefined): theia.ProviderResult<theia.Uri[]> {
        return [...openedEditors];
    }
}
