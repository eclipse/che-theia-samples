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
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    /**
     * Register a hover provider for all types of files.
     *
     * It provides a hover message which contains a word under cursor.
     */
    context.subscriptions.push(
        theia.languages.registerHoverProvider({ scheme: 'file' }, {
            provideHover(doc: theia.TextDocument, position: theia.Position) {
                const range = doc.getWordRangeAtPosition(position);
                const text = `Word under cursor is **${doc.getText(range)}**`;
                return new theia.Hover(text);
            }
        })
    );
}

export function stop() {

}
