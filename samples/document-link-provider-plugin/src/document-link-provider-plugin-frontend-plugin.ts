/**
 * Sample plugin which demonstrates the Document Link Provider Plug-in API.
 *
 * Adds detection 3 types of links:
 * - the external http(s) links;
 * - the internal links to a document;
 * - the links to execute an editor command.
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    const documentSelector: theia.DocumentSelector = { scheme: 'file' };
    const linksProvider: theia.DocumentLinkProvider = {
        provideDocumentLinks: provideLinks,
        resolveDocumentLink: resolveLink
    };
    context.subscriptions.push(theia.languages.registerDocumentLinkProvider(documentSelector, linksProvider));
}

export function stop() {
}

function provideLinks(document: theia.TextDocument): theia.ProviderResult<theia.DocumentLink[]> {

    // Example of providing an external http(s) link.
    const httpLinks = getRanges(document, 'RHT').map(r => new theia.DocumentLink(r, theia.Uri.parse('https://www.redhat.com')));

    // Example of providing an internal link, which points to the first line of the current document.
    const fileLinks = getRanges(document, 'go to line').map(r => new theia.DocumentLink(r, document.uri.with({ fragment: 'L1' })));

    // Example of providing a link to an editor command.
    // Note, here we return an incomplete link, without a target specified.
    // Such link will be resolved after clicking on it.
    const commandLinks = getRanges(document, 'comment').map(r => new theia.DocumentLink(r));

    return [...httpLinks, ...fileLinks, ...commandLinks];
}

/**
 * Fills the given link's target with the editor command.
 *
 * @param link the link that is to be resolved
 */
function resolveLink(link: theia.DocumentLink): theia.ProviderResult<theia.DocumentLink> {
    link.target = theia.Uri.parse('command:editor.action.commentLine')
    return link;
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
