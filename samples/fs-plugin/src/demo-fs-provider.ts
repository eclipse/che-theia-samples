/*********************************************************************
* Copyright (c) 2019 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

import * as theia from '@theia/plugin';

export class DemoFileSystemProvider implements theia.FileSystemProvider {

    private readonly files = new Map<string, Uint8Array>();

    private readonly onDidChangeFileEmitter: theia.EventEmitter<theia.FileChangeEvent[]> = new theia.EventEmitter<theia.FileChangeEvent[]>();

    onDidChangeFile: theia.Event<theia.FileChangeEvent[]> = this.onDidChangeFileEmitter.event;

    watch(uri: theia.Uri, options: { recursive: boolean; excludes: string[] }): theia.Disposable {
        return new theia.Disposable(() => { });
    }

    stat(uri: theia.Uri): theia.FileStat {
        return {
            type: theia.FileType.File,
            ctime: 0,
            mtime: 0,
            size: 65536
        };
    }

    readDirectory(uri: theia.Uri): [string, theia.FileType][] | PromiseLike<[string, theia.FileType][]> {
        return [];
    }

    createDirectory(uri: theia.Uri): void | PromiseLike<void> {
        // no-op
    }

    readFile(uri: theia.Uri): Uint8Array | PromiseLike<Uint8Array> {
        const content = this.files.get(uri.toString());
        if (!content) {
            throw theia.FileSystemError.FileNotFound(uri);
        }
        return content;
    }

    writeFile(uri: theia.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): void | PromiseLike<void> {
        this.files.set(uri.toString(), content);
    }

    delete(uri: theia.Uri, options: { recursive: boolean }): void | PromiseLike<void> {
        // no-op
    }

    rename(oldUri: theia.Uri, newUri: theia.Uri, options: { overwrite: boolean }): void | PromiseLike<void> {
        // no-op
    }
}
