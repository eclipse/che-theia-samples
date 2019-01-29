
/**
 * Sample demonstrates using terminal api.
 */

import * as theia from '@theia/plugin';

export namespace Commands {
    export const CreateTerminalWithHelpArgs: theia.Command = {
        id: 'terminal-created-with-help-args',
        label: 'Create terminal with help arguments.'
    }

    export const CreateTerminalWithHelpOptions: theia.Command = {
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

    export const ShowTerminalList: theia.Command = {
        id: 'show-terminal-list',
        label: 'Show list of the terminals'
    }

    export const ShowActiveTerminal: theia.Command = {
        id: 'show-active-terminal',
        label: 'Track current active terminal during 10c.',
    }

    export const SubscribeToOnDidChangeActiveTerminal: theia.Command = {
        id: 'subscribe-to-on-did-change-active-terminal',
        label: 'Subscribe to on did change active terminal event.'
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

    context.subscriptions.push(theia.commands.registerCommand(Commands.ShowTerminalList, () => {
        console.log('Amount opened terminals: ', theia.window.terminals.length);
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.ShowActiveTerminal, () => {
        console.log('Begin track active terminal during 10 sec.');
        const trackActiveTerminalInterval = setInterval(async () => {
            const active = theia.window.activeTerminal;
            if (active) {
                const id = await active.processId;
                console.log('Active terminal: ', id);
            }
        }, 500);
        setTimeout(() => {
            console.log('Timeout. Complete track active terminal.');
            clearInterval(trackActiveTerminalInterval)
        }, 10000);

        context.subscriptions.push(theia.Disposable.create(() => { clearInterval(trackActiveTerminalInterval); }));
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

export function stop() {

}
