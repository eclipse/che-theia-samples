
/**
 * Sample demonstrates using terminal api.
 */

import * as theia from '@theia/plugin';

export namespace Commands {
    export const CreateTerminalWithHelpArgs: theia.CommandDescription = {
        id: 'terminal-created-with-help-of-args',
        label: 'Create terminal with help of arguments.'
    }

    export const CreateTerminalWithHelpOptions: theia.CommandDescription = {
        id: 'terminal-created-with-help-of-options',
        label: 'Create terminal with help of options.'
    }

    export const SendTextToTheTerminal: theia.CommandDescription = {
        id: 'send-text-to-the-terminal',
        label: 'Send text to the terminal.'
    }

    export const HidePanelWithTerminal: theia.CommandDescription = {
        id: 'hide-terminal-panel',
        label: 'Hide terminal panel after 3 sec.'
    }

    export const CreateTerminalWithDelay: theia.CommandDescription = {
        id: 'create-terminal-with-delay',
        label: 'Create terminal after 3 sec.'
    }

    export const DisposeTerminal: theia.CommandDescription = {
        id: 'dispose-terminal',
        label: 'Dispose terminal after 3 sec.'
    }

    export const SubscribeToOnDidCloseTerminalEvent: theia.CommandDescription = {
        id: 'subscribe-on-did-close-terminal-event',
        label: 'Subscribe to onDidCloseTerminal event.'
    }

    export const SubcribeToOnDidOpenTerminalEvent: theia.CommandDescription = {
        id: 'subscribe-on-did-open-terminal-even',
        label: 'Subscribe to onDidOpenTerminal event.'
    }

    export const SubscribeToOnDidChangeActiveTerminal: theia.CommandDescription = {
        id: 'subscribe-to-on-did-change-active-terminal',
        label: 'Subscribe to onDidChangeActiveTerminal event.'
    }

    export const ShowAmountOfOpenedTerminals: theia.CommandDescription = {
        id: 'show-amount-of-opened-terminals',
        label: 'Show amount of opened terminals.'
    }

    export const TrackActiveTerminal: theia.CommandDescription = {
        id: 'track-active-terminal',
        label: 'Track current active terminal during 30c.',
    }
}

export function start(context: theia.PluginContext) {
    context.subscriptions.push(theia.commands.registerCommand(Commands.CreateTerminalWithHelpArgs, () => {
        const terminal = theia.window.createTerminal('Sh Terminal', 'sh', ['-l']);
        terminal.show();
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.CreateTerminalWithHelpOptions, () => {
        const termOptions: theia.TerminalOptions = {
            name: 'Test terminal',
            shellPath: '/bin/bash',
            shellArgs: ['-l'],
            env: { 'HELLO': 'Hello Theia.' },
            // cwd: '/home/user/projects/che' // any existed absolute path or url to the folder
        }
        const terminal = theia.window.createTerminal(termOptions);
        terminal.show();
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.SendTextToTheTerminal, () => {
        const terminal = createTerminalWithOptions();
        terminal.show();
        terminal.sendText('clear && echo Theia plugin terminal.\n');
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.HidePanelWithTerminal, async () => {
        const terminal = createTerminalWithOptions();
        terminal.show();
        await sleep(3000);
        terminal.hide();
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.CreateTerminalWithDelay, async () => {
        const terminal = createTerminalWithOptions();
        await sleep(3000);
        terminal.show();
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.DisposeTerminal, async () => {
        const terminal = createTerminalWithOptions();
        terminal.show();
        await sleep(3000);
        terminal.dispose();
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.SubscribeToOnDidCloseTerminalEvent, async () => {
        const terminal = createTerminalWithOptions();
        terminal.show();
        const processId = await terminal.processId;

        context.subscriptions.push(theia.window.onDidCloseTerminal(async (closedTerminal: theia.Terminal) => {
            const closedTerminalId = await closedTerminal.processId;
            if (closedTerminalId === processId) {
                console.log('Terminal closed, id: ', processId);
            }
        }, processId));
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.SubcribeToOnDidOpenTerminalEvent, async () => {
        console.log('Track onOpenTerminal event.');
        context.subscriptions.push(theia.window.onDidOpenTerminal(async (openedTerminal: theia.Terminal) => {
            const openedTerminalId = await openedTerminal.processId;
            console.log('Opened terminal with id: ', openedTerminalId);
        }));
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.ShowAmountOfOpenedTerminals, () => {
        console.log('Amount opened terminals: ', theia.window.terminals.length);
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.TrackActiveTerminal, async () => {
        console.log('Begin track active terminal during 10 sec.');
        const trackActiveTerminalInterval = setInterval(async () => {
            const active = theia.window.activeTerminal;
            if (active) {
                const id = await active.processId;
                console.log('Active terminal: ', id);
            }
        }, 500);

        context.subscriptions.push(theia.Disposable.create(() => { clearInterval(trackActiveTerminalInterval); }));

        await sleep(30000);
        console.log('Timeout. Complete track active terminal.');
        clearInterval(trackActiveTerminalInterval)
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.SubscribeToOnDidChangeActiveTerminal, () => {
        theia.window.onDidChangeActiveTerminal(async (active: theia.Terminal | undefined) => {
            if (active) {
                const id = await active.processId;
                console.log('Active terminal changed: ', id);
            }
        });
    }));
}

function createTerminalWithOptions(): theia.Terminal {
    const termOptions: theia.TerminalOptions = {
        name: 'Test terminal',
        shellPath: '/bin/bash'
    }
    return theia.window.createTerminal(termOptions);
}

function sleep(milliseconds: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));;
}

export function stop() {

}
