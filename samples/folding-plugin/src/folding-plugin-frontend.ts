
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    const documentsSelector: theia.DocumentSelector = "foldLang";
    const provider = { provideFoldingRanges: provideRanges };

    context.subscriptions.push(theia.languages.registerFoldingRangeProvider(documentsSelector, provider));
    function provideRanges(document: theia.TextDocument): theia.ProviderResult<theia.FoldingRange[]> {
        return [
            // comment1
            {
                start: 4,
                end: 6,
                kind: theia.FoldingRangeKind.Comment
            },
            // comment2
            {
                start: 12,
                end: 16,
                kind: theia.FoldingRangeKind.Comment
            },
            // foldable text
            {
                start: 18,
                end: 20
            },
            // region1
            {
                start: 22,
                end: 24,
                kind: theia.FoldingRangeKind.Region
            },
            // region2
            {
                start: 26,
                end: 28,
                kind: theia.FoldingRangeKind.Region
            }
        ];
    }
}

export function stop() {

}
