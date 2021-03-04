
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    const informationMessageTestCommand = {
        id: 'quick-pick-example',
        label: "Hello World"
    };
    context.subscriptions.push(theia.commands.registerCommand(informationMessageTestCommand, async () => {
        const quickPick = theia.window.createQuickPick();
        quickPick.items = ['First', 'Second', 'Third'].map(item => ({ label: item }));
        quickPick.show();

        const choice = await new Promise<theia.QuickPickItem | undefined>(c => quickPick.onDidAccept(() => {
            c(quickPick.activeItems[0]);
        }));
        if (choice) {
            theia.window.showInformationMessage(choice.label);
        }
    }));

}

export function stop() {
}
