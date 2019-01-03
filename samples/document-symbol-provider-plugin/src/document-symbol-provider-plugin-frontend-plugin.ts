/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

/**
 * Sample plugin demonstrates the Document Symbol Provider Plug-in API.
 * Contributes a document symbol that represents a plugin's entry point - the `start` function.
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    const documentSelector: theia.DocumentSelector = { scheme: 'file' };
    const linksProvider: theia.DocumentSymbolProvider = {
        provideDocumentSymbols: provideSymbols
    };
    context.subscriptions.push(theia.languages.registerDocumentSymbolProvider(documentSelector, linksProvider));
}

export function stop() {
}

function provideSymbols(document: theia.TextDocument): theia.ProviderResult<theia.SymbolInformation[] | theia.DocumentSymbol[]> {
    const symbols = getRanges(document, 'function start(').map(
        r => new theia.SymbolInformation('entry point', theia.SymbolKind.Function, 'Plugin', new theia.Location(document.uri, r))
    );
    return symbols;
}

/**
 * Returns the ranges which contain the given `text` in the specified `document`.
 *
 * @param document the document in which look for the text
 * @param text the text to look for
 */
function getRanges(document: theia.TextDocument, text: string): theia.Range[] {
    const ranges: theia.Range[] = [];
    for (let i = 0; i < document.lineCount; i++) {
        const line: string = document.lineAt(i).text;
        const index = line.indexOf(text);
        if (index !== -1) {
            ranges.push(new theia.Range(i, index, i, index + text.length));
        }
    }
    return ranges;
}
