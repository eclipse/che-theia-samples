import * as theia from '@theia/plugin';

const comments: Map<string, string[]> = new Map<string, string[]>();
comments.set('Ann', ['Great plugin!', 'Can you share the link to this example?']);
comments.set('Yevhen', ['Cleanup your code please']);
comments.set('Sun', ['Do not forget about docs']);

const gitHubProfiles: Map<string, string> = new Map<string, string>();
gitHubProfiles.set('Ann', 'https://github.com/ashumilova');
gitHubProfiles.set('Yevhen', 'https://github.com/evidolob');
gitHubProfiles.set('Sun', 'https://github.com/sunix');

const ON_DID_SELECT_USER = 'treeViewSample.onDidSelectUser';
const ON_DID_SELECT_COMMENT = 'treeViewSample.onDidSelectComment';

export class Comments {

    treeDataProvider: TestDataProvider;
    tree: theia.TreeView<string>;

    selectedUser: string | undefined;

    constructor(context: theia.PluginContext) {
        this.treeDataProvider = new TestDataProvider();
        this.tree = theia.window.createTreeView('comments', { treeDataProvider: this.treeDataProvider });

        this.tree.onDidExpandElement(event => {
            // handle expanding
        });

        this.tree.onDidCollapseElement(event => {
            // handle collapsing
        });

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: 'treeViewSample.addUser',
                label: '[TreeView] Add User'
            }, args => this.addUser(args)));

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: 'treeViewSample.addProfile',
                label: '[TreeView] Add Profile'
            }, args => this.addUserProfile(args)));

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: 'treeViewSample.addComment',
                label: '[TreeView] Add Comment'
            }, args => this.addComment(args)));

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: ON_DID_SELECT_USER,
                label: 'On did select user'
            }, args => this.onDidSelectUser(args)));

        context.subscriptions.push(
            theia.commands.registerCommand({
                id: ON_DID_SELECT_COMMENT,
                label: 'On did select comment'
            }, args => this.onDidSelectComment(args)));
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
                prompt: 'Enter new comment',
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

    addUserProfile(...args: any[]) {
        if (this.selectedUser) {
            theia.window.showInputBox({
                prompt: 'Enter user profile',
                placeHolder: 'User Profile'
            }).then(value => {
                if (value) {
                    gitHubProfiles.set(this.selectedUser!, value);
                    this.treeDataProvider.sendDataChanged();
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
            let gitLink = gitHubProfiles.get(element);
            return Promise.resolve({
                label: element + (gitLink ? ` [GitHub](${gitLink})` : ''),
                iconPath: 'fa-user medium-yellow',
                command: {
                    id: ON_DID_SELECT_USER,
                    arguments: [element]
                },
                contextValue: 'user',
                collapsibleState: theia.TreeItemCollapsibleState.Expanded
            });
        }

        return Promise.resolve({
            label: element,
            iconPath: 'fa-sticky-note medium-red',
            command: {
                id: ON_DID_SELECT_COMMENT,
                arguments: [element]
            },
            contextValue: 'comment'
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
