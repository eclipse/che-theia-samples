import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {

    context.subscriptions.push(

        theia.languages.registerRenameProvider('markdown', {
            provideRenameEdits: (document: theia.TextDocument, position: theia.Position, newName: string) => {

                /**
                 * Reject rename operation if a new name contains a non alphanumeric symbol.
                 */
                if (/[^\w]/.test(newName)) {
                    return Promise.reject('Alphanumeric symbols are allowed.');
                }

                /**
                 * Replace a word at given position with a new one.
                 */
                const edit = new theia.WorkspaceEdit();
                const range = document.getWordRangeAtPosition(position);
                if (range) {
                    edit.replace(document.uri, range, newName);
                }

                return edit;
            }
        })
    );
}

export function stop() {

}
