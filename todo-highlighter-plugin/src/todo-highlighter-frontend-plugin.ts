
import * as theia from '@theia/plugin';

const todoStyle = theia.window.createTextEditorDecorationType({
    color: 'red',
    backgroundColor: 'rgba(0,0,255, 0.5)'
});

export function start(context: theia.PluginContext) {

    theia.workspace.onDidChangeTextDocument((event: theia.TextDocumentChangeEvent) => {
        let activeEditor = theia.window.activeTextEditor;
        if (activeEditor) {
            // TODO it is better to analyze differences in event.contentChanges
            activeEditor.setDecorations(todoStyle, getTodoDecorations(activeEditor.document));
        }
    }, undefined, context.subscriptions);

    theia.window.onDidChangeActiveTextEditor((editor: theia.TextEditor | undefined) => {
        if (editor) {
            editor.setDecorations(todoStyle, getTodoDecorations(editor.document));
        }
    }, undefined, context.subscriptions);
}

const todoRegExp = new RegExp('todo[ \t]*(.*)[ \t]*$', 'img');

function getTodoDecorations(document: theia.TextDocument): theia.DecorationOptions[] {
    const documentText = document.getText();
    const decorations: theia.DecorationOptions[] = [];

    let match = todoRegExp.exec(documentText);
    while (match) {
        const decoration: theia.DecorationOptions = {
            range: new theia.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)),
            hoverMessage: match[1]
        };
        decorations.push(decoration);

        match = todoRegExp.exec(documentText);
    }

    return decorations;
}

export function stop() {

}
