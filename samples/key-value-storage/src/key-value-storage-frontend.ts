/**
 * Sample which demonstarates usage of workspace state and global state of plugin.
 *
 * Provides commands for:
 *  - setting / reading / deleting values in plugin global state of the plugin
 *  - setting / reading / deleting values in workspace local state of the plugin
 *  - command to set an object as a value
 *
 * Shows 'test' key from both storages at plugin startup and workspace changes.
 */

import * as theia from '@theia/plugin';

const globalKeysToTrack = ['global-value'];
const localKeysToTrack = ['local-value'];

export function start(context: theia.PluginContext) {

    const outputChannel: theia.OutputChannel = theia.window.createOutputChannel('key-value-storage-log');
    outputChannel.clear();
    outputChannel.show();

    context.subscriptions.push(
        theia.workspace.onDidChangeWorkspaceFolders((event: theia.WorkspaceFoldersChangeEvent) => {
            console.log('========== Workspace changed:', event);
            outputChannel.appendLine('========== Workspace changed');
            printTrackedValues();
        })
    );

    const printValuesCommand = {
        id: 'plugin-key-value-storage-show-data',
        label: "Plugin state: print values"
    };
    context.subscriptions.push(theia.commands.registerCommand(printValuesCommand, (...args: any[]) => {
        printTrackedValues();
        outputChannel.show();
    }));

    const addObjectsAsValuesCommand = {
        id: 'plugin-state-set-objects',
        label: "Plugin state: add object values to test keys"
    };
    context.subscriptions.push(theia.commands.registerCommand(addObjectsAsValuesCommand, (...args: any[]) => {
        const obj1 = { 'field1': 'value1', 'field2': 64, 'obj': { 'sub1': 1, 'sub2': 'stringv' } };
        const obj2 = { 'wsfield1': 'value1', 'wsfield2': 64, 'ws-obj': { 'sub1': 1, 'sub2': 'stringv' } };

        context.globalState.update('test', obj1);
        context.workspaceState.update('test', obj2);

        printTrackedValues();
        outputChannel.show();
    }));

    // Manual set / get / delete

    const getGlobalCommand = {
        id: 'plugin-state-get-global-state-by-key',
        label: "Plugin State: get global value"
    };
    context.subscriptions.push(theia.commands.registerCommand(getGlobalCommand, async (...args: any[]) => {
        const key = await askUserForKey();
        if (key) {
            const value: any = context.globalState.get(key);
            showKeyValue(key, value);
        }
    }));

    const setGlobalCommand = {
        id: 'plugin-state-set-global-state-by-key',
        label: "Plugin State: set global value"
    };
    context.subscriptions.push(theia.commands.registerCommand(setGlobalCommand, async (...args: any[]) => {
        const { key, value } = await askUserForKeyValue();
        if (key && value) {
            context.globalState.update(key, value);
            showUpdatedMessage(key, value);
        }

        printTrackedValues();
    }));

    const deleteGlobalCommand = {
        id: 'plugin-state-delete-global-state-by-key',
        label: "Plugin State: delete global value"
    };
    context.subscriptions.push(theia.commands.registerCommand(deleteGlobalCommand, async (...args: any[]) => {
        const key = await askUserForKey();
        if (key) {
            context.globalState.update(key, undefined);
            showDeletedMessage(key);
        }
    }));

    const getWorkspaceLocalCommand = {
        id: 'plugin-state-get-workspace-local-state-by-key',
        label: "Plugin State: get workspace local value"
    };
    context.subscriptions.push(theia.commands.registerCommand(getWorkspaceLocalCommand, async (...args: any[]) => {
        const key = await askUserForKey();
        if (key) {
            const value: any = context.workspaceState.get(key);
            showKeyValue(key, value);
        }
    }));

    const setWorkspaceLocalCommand = {
        id: 'plugin-state-set-workspace-local-state-by-key',
        label: "Plugin State: set workspace local value"
    };
    context.subscriptions.push(theia.commands.registerCommand(setWorkspaceLocalCommand, async (...args: any[]) => {
        const { key, value } = await askUserForKeyValue();
        if (key && value) {
            context.workspaceState.update(key, value);
            showUpdatedMessage(key, value);
        }

        printTrackedValues();
    }));

    const deleteWorkspaceLocalCommand = {
        id: 'plugin-state-delete-workspace-local-state-by-key',
        label: "Plugin State: delete workspace local value"
    };
    context.subscriptions.push(theia.commands.registerCommand(deleteWorkspaceLocalCommand, async (...args: any[]) => {
        const key = await askUserForKey();
        if (key) {
            context.workspaceState.update(key, undefined);
            showDeletedMessage(key);
        }
    }));

    // Helper functions

    function showKeyValue(key: string, value: any): void {
        if (value) {
            console.log('GET:', key, value);
            theia.window.showInformationMessage(key + ' = ' + value.toString());
        } else {
            const message = 'There is no value for key: ' + key;
            console.log(message);
            theia.window.showInformationMessage(message);
        }
    }

    function showUpdatedMessage(key: string, value: any) {
        const message = 'Updated value for key: "' + key + '"';
        console.log(message, value);
        theia.window.showInformationMessage(message);
    }

    function showDeletedMessage(key: string): void {
        const message = 'Value by key "' + key + '" has been deleted';
        console.log(message);
        theia.window.showInformationMessage(message);
    }

    function printTrackedValues(): void {
        const currentTime = new Date();
        outputChannel.appendLine('----------] ' + currentTime.getHours() + ':'
            + currentTime.getMinutes() + ':' + currentTime.getSeconds() + ' [----------');

        for (let k of globalKeysToTrack) {
            outputChannel.appendLine(k + ' = ' + context.globalState.get(k));
        }

        for (let k of localKeysToTrack) {
            outputChannel.appendLine(k + ' = ' + context.workspaceState.get(k));
        }
    }
}

interface KeyValue {
    key: string | undefined;
    value: string | undefined;
}

async function askUserForKey(): Promise<string | undefined> {
    return theia.window.showInputBox({ placeHolder: 'key' });
}

async function askUserForKeyValue(): Promise<KeyValue> {
    const key = await askUserForKey();
    if (!key) {
        // input was cancelled
        return { key: undefined, value: undefined };
    }

    const value = await theia.window.showInputBox({ placeHolder: 'value' });
    return {
        key: key,
        value: value
    };
}

export function stop() {

}
