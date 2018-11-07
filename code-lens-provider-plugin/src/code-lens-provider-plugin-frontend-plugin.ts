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
 * Sample plugin which demonstrates the Code Lens Provider Plug-in API.
 * Plug-in demonstrated providing two types of link:
 * - with an associated command;
 * - without an associated command - such link will be resolved.
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    const documentSelector: theia.DocumentSelector = { scheme: 'file' };
    const lensProvider: theia.CodeLensProvider = {
        provideCodeLenses: provideLenses,
        resolveCodeLens: resolveLens
    };
    context.subscriptions.push(theia.languages.registerCodeLensProvider(documentSelector, lensProvider));
}

export function stop() {
}

function provideLenses(document: theia.TextDocument): theia.ProviderResult<theia.CodeLens[]> {

    // Example of providing a code lens with an associated command.
    const lens1 = getRanges(document, 'core.about').map(r => new theia.CodeLens(r, {
        id: 'core.about',
        label: 'lens'
    }));

    // Example of providing a link without an associated command.
    // Such lens will be resolved later.
    const lens2 = getRanges(document, 'lens 2').map(r => new theia.CodeLens(r));

    return [...lens1, ...lens2];
}

/**
 * Fills the given lens's command.
 *
 * @param lens a lens that is to be resolved
 */
function resolveLens(lens: theia.CodeLens): theia.ProviderResult<theia.CodeLens> {
    lens.command = {
        id: 'core.about',
        label: 'resolved lens'
    }
    return lens;
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
