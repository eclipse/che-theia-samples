/**
 * Generated using theia-plugin-generator
 * 
 * If it's necessary, update your theia.d.ts with this one
 * https://raw.githubusercontent.com/theia-ide/theia/tree-view/packages/plugin/src/theia.d.ts
 */

import * as theia from '@theia/plugin';
import { FtpExplorer } from './ftp-explorer';
import { Comments } from './comments';

const disposables: theia.Disposable[] = [];

export function start() {
    new Comments(disposables);
    new FtpExplorer();
}

export function stop() {
    while (disposables.length) {
        const disposable = disposables.pop();
        if (disposable) {
            disposable.dispose();
        }
    }
}
