
/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';

export namespace Commands {
    export const CreateTerminalWithHelpArgs: theia.Command = {
        id: "backend-plugin-terminal-created-with-help-args",
        label: "Create terminal with help arguments Server plugin"
    }

    export const CreateTerminalWithOptions: theia.Command = {
        id: "backend-plugin-terminal-created-with-help-options",
        label: "Create terminal with help options Server plugin"
    }

    export const SendTextToTheTerminal: theia.Command = {
        id: "backend-plugin-send-text-to-the-terminal",
        label: "Send text to the terminal Server plugin"
    }

    export const HidePanelWithTerminal: theia.Command = {
        id: "backend-plugin-hide-terminal-panel",
        label: "Hide terminal panel after 3 sec Server plugin"
    }

    export const ShowTerminalWithDelay: theia.Command = {
        id: "backend-plugin-show-terminal-with-delay",
        label: "Show terminal after 3 sec Server plugin"
    }

    export const DisposeTerminal: theia.Command = {
        id: "backend-plugin-dispose-terminal",
        label: "Dispose terminal after 3 sec Server plugin"
    }

    export const SubscribeToOnDidCloseTerminalEvent: theia.Command = {
        id: "backend-plugin-subscribe-on-did-close-terminal-event",
        label: "Subscribe to onDidCloseTerminal event Server plugin"
    }
}

export function start(context: theia.PluginContext) {
    const informationMessageTestCommand = {
        id: 'hello-world-example-generated',
        label: "Hello World"
    };
    context.subscriptions.push(theia.commands.registerCommand(informationMessageTestCommand, (...args: any[]) => {
        theia.window.showInformationMessage('Hello World!');
    }));


    context.subscriptions.push(theia.commands.registerCommand(Commands.CreateTerminalWithHelpArgs, () => {
        const terminal = theia.window.createTerminal("Sh Terminal", "sh", ["-l"]);
        terminal.show();
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.CreateTerminalWithOptions, () => {
        const termOptions: theia.TerminalOptions = {
            name: "Test terminal",
            shellPath: "/bin/bash",
            shellArgs: ["-l"],
            env: { "HELLO": "Hello Theia." },
            // cwd: "/home/user/projects/che" // any existed absolute path or url to the folder
        }
        const terminal = theia.window.createTerminal(termOptions);
        terminal.show();
    }));

    context.subscriptions.push(theia.commands.registerCommand(Commands.SendTextToTheTerminal, () => {
        const terminal = createTerminalWithOptions();
        terminal.show();
        terminal.sendText("clear && echo Theia plugin terminal.\n");
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

    context.subscriptions.push(theia.commands.registerCommand(Commands.SubscribeToOnDidCloseTerminalEvent, () => {
        const terminal = createTerminalWithOptions();
        terminal.show();
        terminal.processId.then(id => {
            theia.window.onDidCloseTerminal(async (term) => {
                const curId = await term.processId;
                if (curId === id) {
                    console.log("Terminal closed, id: ", id);
                }
            }, id);
        });
    }));

}

function createTerminalWithOptions(): theia.Terminal {
    const termOptions: theia.TerminalOptions = {
        name: "Test terminal",
        shellPath: "/bin/bash"
    }
    return theia.window.createTerminal(termOptions);
}

export function stop() {

}
