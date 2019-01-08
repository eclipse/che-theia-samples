import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {

    const colorProvider: theia.DocumentColorProvider = {
        provideColorPresentations: (color: theia.Color, context: { document: theia.TextDocument, range: theia.Range }, token: theia.CancellationToken) => {
            const red256 = Math.round(color.red * 255);
            const green256 = Math.round(color.green * 255);
            const blue256 = Math.round(color.blue * 255);
            let label;
            if (color.alpha === 1) {
                label = "rgb(" + red256 + ", " + green256 + ", " + blue256 + ")";
            } else {
                label = "rgba(" + red256 + ", " + green256 + ", " + blue256 + ", " + color.alpha + ")";
            }

            return [{
                label: label
            }];
        },
        provideDocumentColors: () => {
            return [
                new theia.ColorInformation(
                    new theia.Range(
                        new theia.Position(0, 0),
                        new theia.Position(0, 3)
                    ),
                    new theia.Color(1, 0, 0, 1)
                ),
                new theia.ColorInformation(
                    new theia.Range(
                        new theia.Position(1, 0),
                        new theia.Position(1, 4)
                    ),
                    new theia.Color(0, 0, 1, 1)
                ),
                new theia.ColorInformation(
                    new theia.Range(
                        new theia.Position(2, 0),
                        new theia.Position(2, 5)
                    ),
                    new theia.Color(0, 1, 0, 1)
                ),
            ];
        }
    };

    const disposable = theia.languages.registerColorProvider('colorLang', colorProvider);
    context.subscriptions.push(disposable);
}

export function stop() {

}
