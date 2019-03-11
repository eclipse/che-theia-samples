/*********************************************************************
* Copyright (c) 2019 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

/** Plugin demonstrates using the `workspace.registerFileSystem` API. */
import * as theia from '@theia/plugin';
import { DemoFileSystemProvider } from './demo-fs-provider';

namespace Commands {
    export const OpenFile: theia.CommandDescription = {
        id: 'file.remote.read',
        label: 'Demo FS: Open file...'
    }
}

export function start(context: theia.PluginContext) {
    const scheme = 'demo-fs';
    const demoFS = new DemoFileSystemProvider()
    context.subscriptions.push(theia.workspace.registerFileSystemProvider(scheme, demoFS));

    const files: string[] = [];
    context.subscriptions.push(theia.commands.registerCommand(Commands.OpenFile, async () => {
        const file = await pickFile(files);
        theia.workspace.openTextDocument(theia.Uri.parse(file))
    }));

    // create test files
    const file1 = `${scheme}://folder/file1.txt`;
    files.push(file1);
    demoFS.writeFile(theia.Uri.parse(file1), Buffer.from('foo 1'), { create: true, overwrite: true });

    const file2 = `${scheme}://folder/file2.txt`;
    files.push(file2);
    demoFS.writeFile(theia.Uri.parse(file2), Buffer.from('foo 2'), { create: true, overwrite: true });
}

function pickFile(items: string[]): Promise<string> {
    return new Promise<string>(resolve => {
        const opts = { placeHolder: 'Open' } as theia.QuickPickOptions;
        opts.onDidSelectItem = (item => resolve(typeof item === 'string' ? item : item.label));

        theia.window.showQuickPick(items, opts);
    });
}
