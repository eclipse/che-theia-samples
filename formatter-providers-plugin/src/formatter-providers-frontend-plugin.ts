
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {

    /**
     * Register a document formatting provider for all types of files.
     *
     * This formatter iterates over each line in the document
     * and adds the '+' symbol to the beginning of the line.
     *
     * Open the Command Palette (press F1 or Ctrl+Shift+P) and run command 'Format Document'
     */
    const documentSelector = {scheme: 'file'};
    const documentFormattingProvider = {
        provideDocumentFormattingEdits: (document: theia.TextDocument, options: theia.FormattingOptions) => {
            const edits: theia.TextEdit[] = [];
            for (var i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                const edit = new theia.TextEdit(
                    line.range.with(undefined, line.range.start),
                    '+'
                )
                edits.push(edit);
            }
            return edits;
        }
    };
    context.subscriptions.push(
        theia.languages.registerDocumentFormattingEditProvider(documentSelector, documentFormattingProvider)
    );

    /**
     * Register a document range formatting provider for all types of files.
     *
     * This formatter iterates over selected lines only
     * and adds the '+' symbol to the beginning of the line.
     *
     * Select lines, open the Command Palette (press F1 or Ctrl+Shift+P)
     * and run command 'Format Selection'
     */
    const rangeDocumentSelector = {scheme: 'file'};
    const rangeFormattingProvider = {
        provideDocumentRangeFormattingEdits: (document: theia.TextDocument, range: theia.Range, options: theia.FormattingOptions) => {
            let lineNumber = range.start.line;
            const edits: theia.TextEdit[] = [];
            while (lineNumber <= range.end.line) {
                const line = document.lineAt(lineNumber);
                const edit = new theia.TextEdit(
                    line.range.with(undefined, line.range.start),
                    '+'
                )
                edits.push(edit);
                lineNumber++;
            }
            return edits;
        }
    };
    context.subscriptions.push(
        theia.languages.registerDocumentRangeFormattingEditProvider(rangeDocumentSelector, rangeFormattingProvider)
    );

    /**
     * Register an on-type formatting provider for all types of files.
     *
     * This formatter adds the '+' symbol to the beginning of a line
     * where a trigger character is entered.
     *
     * Notice: `editor.formatOnType` has to be enabled in User Settings.
     *
     * Start typing and press ';' symbol or hit 'Enter' for a new line.
     * The '+' symbol should appear at the beginning of the line.
     */
    const onTypeDocumentSelector = {scheme: 'file'};
    const onTypeFormattingProvider = {
        provideOnTypeFormattingEdits: (document: theia.TextDocument, position: theia.Position, ch: string, options: theia.FormattingOptions) => {
            const edit = new theia.TextEdit(
                new theia.Range(position.with(undefined, 0), position.with(undefined, 0)),
                '+'
            );
            return [edit];
        }
    };
    const firstTriggerCharacter = ';';
    const moreTriggerCharacter: string[] = ['\n'];
    context.subscriptions.push(
        theia.languages.registerOnTypeFormattingEditProvider(onTypeDocumentSelector, onTypeFormattingProvider, firstTriggerCharacter, ...moreTriggerCharacter)
    )
}

export function stop() {

}
