import * as theia from '@theia/plugin';

const comments: Map<string, string[]> = new Map<string, string[]>();

comments.set('Ann', ['Great plugin!', 'Can you share the link to this example?']);
comments.set('Yevhen', ['Cleanup your code please']);
comments.set('Sun', ['Do not forget about docs']);

const onDidSelectUserCommand: theia.Command = {
    id: 'comments-tree-on-did-select-user',
    label: 'On did select user'
};

const onDidSelectCommentCommand: theia.Command = {
    id: 'comments-tree-on-did-select-comment',
    label: 'On did select comment'
};

let treeDataProvider: TestDataProvider;

export class Comments {

    constructor(public disposables: theia.Disposable[]) {
        treeDataProvider = new TestDataProvider();
        const tree = theia.window.createTreeView('comments', { treeDataProvider });

        tree.onDidExpandElement(event => {
            // handle expanding
        });

        tree.onDidCollapseElement(event => {
            // handle collapsing
        });

        theia.commands.registerCommand({
            id: 'tree-view-add-user',
            label: '[TreeView] Add User'
        }, addUser);

        theia.commands.registerCommand({
            id: 'tree-view-add-comment',
            label: '[TreeView] Add Comment'
        }, addComment);

        theia.commands.registerCommand(onDidSelectUserCommand, onDidSelectUser);
        theia.commands.registerCommand(onDidSelectCommentCommand, onDidSelectComment);
    }

}

let selectedUser: string | undefined = undefined;

export function onDidSelectUser(...args: any[]) {
    if (args && args.length > 0) {
        selectedUser = args[0].toString();
    } else {
        selectedUser = undefined;
    }
}

export function onDidSelectComment(...args: any[]) {
    selectedUser = undefined;

    if (args && args.length > 0) {
        let selectedComment = args[0].toString();
        comments.forEach((comments, user) => {
            comments.forEach(comment => {
                if (selectedComment === comment) {
                    selectedUser = user;
                }
            });
        });
    }
}

export function addUser(...args: any[]) {
    theia.window.showInputBox({
        prompt: 'Type user name to be added to the list',
        placeHolder: 'User name'
    }).then(value => {
        if (value) {
            comments.set(value, []);
            treeDataProvider.sendDataChanged();
        }
    });
}

export function addComment(...args: any[]) {
    if (selectedUser) {
        theia.window.showInputBox({
            prompt: 'Type comment added to user',
            placeHolder: 'Comment'
        }).then(value => {
            if (value) {
                const commentsArray: string[] | undefined = comments.get(selectedUser!);
                if (commentsArray) {
                    commentsArray.push(value);
                    treeDataProvider.sendDataChanged();
                }
            }
        });
    }
}

export class TestDataProvider implements theia.TreeDataProvider<string> {

    private onDidChangeTreeDataEmitter: theia.EventEmitter<any> = new theia.EventEmitter<any>();
    readonly onDidChangeTreeData: theia.Event<any> = this.onDidChangeTreeDataEmitter.event;

    public sendDataChanged() {
        this.onDidChangeTreeDataEmitter.fire();
    }

    /**
     * Get [TreeItem](#TreeItem) representation of the `element`
     *
     * @param element The element for which [TreeItem](#TreeItem) representation is asked for.
     * @return [TreeItem](#TreeItem) representation of the element
     */
    getTreeItem(element: string): theia.TreeItem | PromiseLike<theia.TreeItem> {
        if (comments.has(element)) {
            return Promise.resolve({
                label: element,
                iconPath: 'fa-user medium-yellow',
                command: {
                    id: onDidSelectUserCommand.id,
                    arguments: [element]
                },

                collapsibleState: theia.TreeItemCollapsibleState.Expanded
            });
        }

        return Promise.resolve({
            label: element,
            iconPath: 'fa-sticky-note medium-red',
            command: {
                id: onDidSelectCommentCommand.id,
                arguments: [element]
            },

        });
    }

    async getChildren(element?: string): Promise<string[]> {
        if (element && comments.has(element)) {
            return comments.get(element)!;
        } else {
            return await this.getRootChildren();
        }
    }

    async getRootChildren(): Promise<string[]> {
        const arr: string[] = [];
        comments.forEach((value, key) => {
            arr.push(key);
        })

        return arr;
    }

}
