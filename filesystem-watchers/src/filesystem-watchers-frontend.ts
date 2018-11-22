/**
 * Sample plugin to demonstrate file system watching abilities of plugin.
 *
 * Provides commands for
 *   - subscribing for file system events:
 *      * creating / updating / deleting of C++ files (h, hpp, c, cpp) inside all src directories for all workspace folders
 *      * creating / deleting of file with name package.json (location inside workspace doesn't matter) for the first workspace folder only
 *      * updating any typescript or javascript file for all workspace folders
 *   - unsubscribing from file system events
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {

    let watchers: theia.FileSystemWatcher[] = [];

    const createWatchers = {
        id: 'create-watchers',
        label: "Create file system watchers"
    };
    context.subscriptions.push(theia.commands.registerCommand(createWatchers, (...args: any[]) => {
        if (watchers.length !== 0) {
            console.log('>> File system watchers already created');
            return;
        }

        console.log('>> Creating file system watchers');

        const cppPattern = '**/src/**/*.{h,c,hpp,cpp}';
        const cppWatcher = theia.workspace.createFileSystemWatcher(cppPattern);
        cppWatcher.onDidCreate(uri => console.log('C++ source file created:', uri.toString()));
        cppWatcher.onDidChange(uri => console.log('C++ source file modified:', uri.toString()));
        cppWatcher.onDidDelete(uri => console.log('C++ source file deleted:', uri.toString()));
        watchers.push(cppWatcher);
        console.log('>> C++ files watcher created. Monitoring all scr folders.');

        // watch for creation and deletion of any package.json file inside first workspace folder
        let jsonWatcher: theia.FileSystemWatcher | undefined;
        const workspaceFolders = theia.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders[0]) {
            // a workspace is opened
            const wsRoot0 = workspaceFolders[0];
            const jsonPattern = new theia.RelativePattern(wsRoot0, '**/package.json');
            jsonWatcher = theia.workspace.createFileSystemWatcher(jsonPattern, false, true, false);
            jsonWatcher.onDidCreate(uri => console.log('package.json file created:', uri.toString()));
            jsonWatcher.onDidChange(uri => console.log('Should never be triggered: package.json file modified:', uri.toString()));
            jsonWatcher.onDidDelete(uri => console.log('package.json file deleted:', uri.toString()));
            watchers.push(jsonWatcher);
            console.log('>> package.json watcher created. Monitoring creating / deletion of package.json files inside first workspace root folder.');
        } else {
            console.log('>> package.json watcher hasn\'t been created, no opened workspace');
        }

        // watch for changes in all typescript and javascript source files (inside all waorkspaces)
        const tsjsPattern = '**/*.{ts,js}';
        const tsjsWatcher = theia.workspace.createFileSystemWatcher(tsjsPattern, true, false, true);
        tsjsWatcher.onDidCreate(uri => console.log('Should never be triggered: typescript or javascript source file is created', uri.toString()));
        tsjsWatcher.onDidChange(uri => {
            if (uri.fsPath.endsWith('ts')) {
                console.log('>> typescript source file is modified:', uri.toString());
            } else {
                console.log('>> javascript source file is modified:', uri.toString());
            }
        });
        tsjsWatcher.onDidDelete(uri => console.log('Should never be triggered: typescript or javascript source file is deleted', uri.toString()));
        watchers.push(tsjsWatcher);
        console.log('>> ts/js files watcher created. Monitoring all changes in all typescript and javascript files.');
    }));

    const removeWatchers = {
        id: 'remove-watchers',
        label: "Remove file system watchers"
    };
    context.subscriptions.push(theia.commands.registerCommand(removeWatchers, (...args: any[]) => {
        for (let watcher of watchers) {
            watcher.dispose();
        }
        watchers = [];

        console.log('>> All file system watches removed');
    }));
}

export function stop() {

}
