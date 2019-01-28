
/**
 * Sample demonstrate using terminal api.
 */

import * as theia from '@theia/plugin';

export namespace Commands {
    export const CreateTerminalWithHelpArgs: theia.Command = {
        id: 'terminal-created-with-help-args',
        label: 'Create terminal with help arguments.'
    }

    export const CreateTerminalWithOptions: theia.Command = {
        id: 'terminal-created-with-help-options',
        label: 'Create terminal with help options.'
    }

    export const SendTextToTheTerminal: theia.Command = {
        id: 'send-text-to-the-terminal',
        label: 'Send text to the terminal.'
    }

    export const HidePanelWithTerminal: theia.Command = {
        id: 'hide-terminal-panel',
        label: 'Hide terminal panel after 3 sec.'
    }

    export const ShowTerminalWithDelay: theia.Command = {
        id: 'show-terminal-with-delay',
        label: 'Show terminal after 3 sec.'
    }

    export const DisposeTerminal: theia.Command = {
        id: 'dispose-terminal',
        label: 'Dispose terminal after 3 sec.'
    }

    export const SubscribeToOnDidCloseTerminalEvent: theia.Command = {
        id: 'subscribe-on-did-close-terminal-event',
        label: 'Subscribe to onDidCloseTerminal event.'
    }

    export const SubcribeToOnDidOpenTerminalEvent: theia.Command = {
        id: 'subscribe-on-did-open-terminal-even',
        label: 'Subscribe to onDidOpenTerminal event.'
    }

    export const ShowListTerminals: theia.Command = {
        id: 'show-list-terminals',
        label: "Show list of the terminals"
    }
}

export function start(context: theia.PluginContext) {
    context.subscriptions.push(theia.commands.registerCommand(Commands.CreateTerminalWithHelpArgs, () => {
        console.log('current active terminal' + theia.window.activeTerminal);
        const terminal = theia.window.createTerminal('Sh Terminal', 'sh', ['-l']);
        terminal.show();
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.CreateTerminalWithOptions, () => {
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

    context.subscriptions.push(theia.commands.registerCommand(Commands.HidePanelWithTerminal, () => {
        const terminal = createTerminalWithOptions();
        terminal.show();
        setTimeout(function() {
            terminal.hide();
        }, 3000);
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.ShowTerminalWithDelay, () => {
        const terminal = createTerminalWithOptions();
        setTimeout(function() {
            terminal.show();
        }, 3000);
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.DisposeTerminal, () => {
        const terminal = createTerminalWithOptions();
        terminal.show();
        setTimeout(function() {
            terminal.dispose();
        }, 3000);
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
            console.log('Opened terminal with id', openedTerminalId);
        }));
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.ShowListTerminals, () => {
        console.log('Terminal list: ', theia.window.terminals);
    }))
}

function createTerminalWithOptions(): theia.Terminal {
    const termOptions: theia.TerminalOptions = {
        name: 'Test terminal',
        shellPath: '/bin/bash'
    }
    return theia.window.createTerminal(termOptions);
}

export function stop() {

}
