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

export function start(context: theia.PluginContext) {

    console.log('On start: global value by "test" key is: ', context.globalState.get('test'));
    console.log('On start: workspace local value by "test" key is: ', context.workspaceState.get('test'));

    context.subscriptions.push(
        theia.workspace.onDidChangeWorkspaceFolders((event: theia.WorkspaceFoldersChangeEvent) => {
            console.log('Workspace changed:', event);

            console.log('On workspace changed: global value by "test" key is: ', context.globalState.get('test'));
            console.log('On workspace changed: workspace local value by "test" key is: ', context.workspaceState.get('test'));
        })
    );

    const AddObjectsAsValuesCommand = {
        id: 'plugin-state-set-object-value',
        label: "Plugin state: set object values to test key"
    };
    context.subscriptions.push(theia.commands.registerCommand(AddObjectsAsValuesCommand, (...args: any[]) => {
        context.globalState.update('test', { 'field1': 'value1', 'field2': 64, 'obj': { 'sub1': 1, 'sub2': 'stringv' } });
        context.workspaceState.update('test', { 'wsfield1': 'value1', 'wsfield2': 64, 'ws-obj': { 'sub1': 1, 'sub2': 'stringv' } });
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
