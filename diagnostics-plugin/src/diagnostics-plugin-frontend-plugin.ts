/**
 * Sample plugin which demonstrates diagnostics API.
 *
 * Provides commands for:
 *   - adding warning diagnostic for words `window`
 *   - removing warning diagnostic for words `window`
 *   - adding error diagnostic for words `const`
 *   - removing error diagnostic for words `const`
 *   - toggle updating diagnostics on type
 *
 * Tracks diagnostics changes.
 */

import * as theia from '@theia/plugin';

let autoDiagnostics: boolean = false;

const disposables: theia.Disposable[] = [];
export function stop() {
    for (const disposable of disposables) {
        disposable.dispose();
    }
}

export function start() {
    const warningsDiagnosticsCollection = theia.languages.createDiagnosticCollection('test-warnings');
    const errorsDiagnosticsCollection = theia.languages.createDiagnosticCollection('test-errors');

    disposables.push(warningsDiagnosticsCollection);
    disposables.push(errorsDiagnosticsCollection);

    // Warnings

    const addWarningDiagnostics = {
        id: 'add-warning-diagnostics',
        label: "Add warning diagnostics"
    };

    disposables.push(
        theia.commands.registerCommand(addWarningDiagnostics, (...args: any[]) => {
            if (theia.window.activeTextEditor) {
                const editorResourceUri = theia.window.activeTextEditor.document.uri;
                warningsDiagnosticsCollection.set(editorResourceUri, createWarningDiagnostics());

                console.log('>> Added warning diagnostics for: ' + editorResourceUri.toString());
            } else {
                theia.window.showInformationMessage('No open document');
            }
        })
    );

    const removeWarningDiagnostics = {
        id: 'remove-warning-diagnostics',
        label: "Remove warning diagnostics"
    };

    disposables.push(
        theia.commands.registerCommand(removeWarningDiagnostics, (...args: any[]) => {
            if (theia.window.activeTextEditor) {
                const editorResourceUri = theia.window.activeTextEditor.document.uri;
                warningsDiagnosticsCollection.delete(editorResourceUri);

                console.log('>> Removed all warning diagnostics for: ' + editorResourceUri.toString());
            } else {
                theia.window.showInformationMessage('No open document');
            }
        })
    );

    // Errors

    const addErrorDiagnostics = {
        id: 'add-errors-diagnostics',
        label: "Add error diagnostics"
    };

    disposables.push(
        theia.commands.registerCommand(addErrorDiagnostics, (...args: any[]) => {
            if (theia.window.activeTextEditor) {
                const editorResourceUri = theia.window.activeTextEditor.document.uri;
                errorsDiagnosticsCollection.set(editorResourceUri, createErrorDiagnostics());

                console.log('>> Added error diagnostics for: ' + editorResourceUri.toString());
            } else {
                theia.window.showInformationMessage('No open document');
            }
        })
    );

    const removeErrorDiagnostics = {
        id: 'remove-errors-diagnostics',
        label: "Remove error diagnostics"
    };

    disposables.push(
        theia.commands.registerCommand(removeErrorDiagnostics, (...args: any[]) => {
            if (theia.window.activeTextEditor) {
                const editorResourceUri = theia.window.activeTextEditor.document.uri;
                errorsDiagnosticsCollection.delete(editorResourceUri);

                console.log('>> Removed all error diagnostics for: ' + editorResourceUri.toString());
            } else {
                theia.window.showInformationMessage('No open document');
            }
        })
    );

    // Events

    disposables.push(
        theia.languages.onDidChangeDiagnostics((event: theia.DiagnosticChangeEvent) => {
            let message = 'Diagnostics changed for: ';
            for (const uri of event.uris) {
                message += ' ' + uri.toString();
            }
            console.log(message);
        })
    );

    const toggleAutoDiagnostics = {
        id: 'toggle-auto-diagnostics',
        label: "Toggle auto adding diagnostics"
    };

    theia.commands.registerCommand(toggleAutoDiagnostics, (...args: any[]) => {
        autoDiagnostics = !autoDiagnostics;
    });

    disposables.push(
        theia.workspace.onDidChangeTextDocument((event: theia.TextDocumentChangeEvent) => {
            if (autoDiagnostics && theia.window.activeTextEditor) {
                const editorResourceUri = theia.window.activeTextEditor.document.uri;
                // This is only example, in real plugin analyze changed text, do not process all the document each time.
                warningsDiagnosticsCollection.set(editorResourceUri, createWarningDiagnostics());
                errorsDiagnosticsCollection.set(editorResourceUri, createErrorDiagnostics());
            }
        })
    );

}

function createWarningDiagnostics(): theia.Diagnostic[] {
    return createDiagnosticsForWord('window', theia.DiagnosticSeverity.Warning);
}

function createErrorDiagnostics(): theia.Diagnostic[] {
    return createDiagnosticsForWord('const', theia.DiagnosticSeverity.Error);
}

function createDiagnosticsForWord(word: string, severity: theia.DiagnosticSeverity) {
    if (theia.window.activeTextEditor) {
        let diagnostics: theia.Diagnostic[] = [];
        let counter: number = 0;

        const linesNumber = theia.window.activeTextEditor.document.lineCount;
        if (linesNumber < 1) {
            return [];
        }

        for (let i = 0; i < linesNumber; i++) {
            const line: string = theia.window.activeTextEditor.document.lineAt(i).text;
            const index = line.indexOf(word);
            if (index !== -1) {
                diagnostics.push(new theia.Diagnostic(
                    new theia.Range(i, index, i, index + word.length),
                    'Diagnostic message from plugin for "' + word + '" number ' + ++counter,
                    severity
                ));
            }
        }

        return diagnostics;
    }
    return [];
}
