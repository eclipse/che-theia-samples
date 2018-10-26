import * as theia from '@theia/plugin';

const comments: Map<string, string[]> = new Map<string, string[]>();

comments.set('Ann', ['Great plugin!', 'Can you share the link to this example?']);
comments.set('Yevhen', ['Cleanup your code please']);
comments.set('Sun', ['Do not forget about docs']);

const ON_DID_SELECT_USER = 'comments-tree-on-did-select-user';
const ON_DID_SELECT_COMMENT = 'comments-tree-on-did-select-comment';

export class Comments {

    treeDataProvider: TestDataProvider;
    tree: theia.TreeView<string>;

    selectedUser: string | undefined = undefined;

    constructor(public disposables: theia.Disposable[]) {
        this.treeDataProvider = new TestDataProvider();
        this.tree = theia.window.createTreeView('comments', { treeDataProvider: this.treeDataProvider });

        this.tree.onDidExpandElement(event => {
            // handle expanding
        });

        this.tree.onDidCollapseElement(event => {
            // handle collapsing
        });

        theia.commands.registerCommand({
            id: 'tree-view-add-user',
            label: '[TreeView] Add User'
        }, args => this.addUser(args));

        theia.commands.registerCommand({
            id: 'tree-view-add-comment',
            label: '[TreeView] Add Comment'
        }, args => this.addComment(args));

        theia.commands.registerCommand({
            id: ON_DID_SELECT_USER,
            label: 'On did select user'
        }, args => this.onDidSelectUser(args));

        theia.commands.registerCommand({
            id: ON_DID_SELECT_COMMENT,
            label: 'On did select comment'
        }, args => this.onDidSelectComment(args));
    }

    onDidSelectUser(...args: any[]) {
        if (args && args.length > 0) {
            this.selectedUser = args[0].toString();
        } else {
            this.selectedUser = undefined;
        }
    }

    onDidSelectComment(...args: any[]) {
        this.selectedUser = undefined;

        if (args && args.length > 0) {
            let selectedComment = args[0].toString();
            comments.forEach((comments, user) => {
                comments.forEach(comment => {
                    if (selectedComment === comment) {
                        this.selectedUser = user;
                    }
                });
            });
        }
    }

    addUser(...args: any[]) {
        theia.window.showInputBox({
            prompt: 'Type user name to be added to the list',
            placeHolder: 'User name'
        }).then(value => {
            if (value) {
                comments.set(value, []);
                this.treeDataProvider.sendDataChanged();

                setTimeout(() => {
                    this.tree.reveal(value);
                }, 100);
            }
        });
    }

    addComment(...args: any[]) {
        if (this.selectedUser) {
            theia.window.showInputBox({
                prompt: 'Type comment added to user',
                placeHolder: 'Comment'
            }).then(value => {
                if (value) {
                    const commentsArray: string[] | undefined = comments.get(this.selectedUser!);
                    if (commentsArray) {
                        commentsArray.push(value);
                        this.treeDataProvider.sendDataChanged();

                        setTimeout(() => {
                            this.tree.reveal(value);
                        }, 100);
                    }
                }
            });
        }
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
                    id: ON_DID_SELECT_USER,
                    arguments: [element]
                },

                collapsibleState: theia.TreeItemCollapsibleState.Expanded
            });
        }

        return Promise.resolve({
            label: element,
            iconPath: 'fa-sticky-note medium-red',
            command: {
                id: ON_DID_SELECT_COMMENT,
                arguments: [element]
            }
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
