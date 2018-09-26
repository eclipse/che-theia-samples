/**
 * Sample plugin which demonstrates definition provider plugin API.
 *
 * Searches for function stop in current document and if it exists adds the function as a definition source (for any symbol).
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    const documentsSelector: theia.DocumentSelector = { scheme: 'file', language: 'typescript' };
    const handler: theia.DefinitionProvider = { provideDefinition: provideDefinitionHandler };

    context.subscriptions.push(
        theia.languages.registerDefinitionProvider(documentsSelector, handler)
    );

}

function provideDefinitionHandler(document: theia.TextDocument, position: theia.Position): theia.ProviderResult<theia.Definition | theia.DefinitionLink[]> {
    console.log('Definition provider is triggered');

    // Just sample, ignores actual caret position and uses hardcoded value instead.
    const range: theia.Range | undefined = findFunction(document, 'stop');
    if (range) {
        return new theia.Location(document.uri, range);
    }

    return undefined;
}

function findFunction(document: theia.TextDocument, name: string): theia.Range | undefined {
    const functionPrefix = 'function ';
    const definitionString = functionPrefix + name + '(';
    for (let i = 0; i < document.lineCount; i++) {
        const line: string = document.lineAt(i).text;
        const index = line.indexOf(definitionString);
        if (index !== -1) {
            return new theia.Range(i, index + functionPrefix.length,
                i, index + functionPrefix.length + name.length);
        }
    }

    return undefined;
}

export function stop() {

}
