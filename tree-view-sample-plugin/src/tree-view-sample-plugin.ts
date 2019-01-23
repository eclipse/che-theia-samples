/**
 * Generated using theia-plugin-generator
 *
 * If it's necessary, update your theia.d.ts with this one
 * https://raw.githubusercontent.com/theia-ide/theia/tree-view/packages/plugin/src/theia.d.ts
 */

import * as theia from '@theia/plugin';
import { FtpExplorer } from './ftp-explorer';
import { Comments } from './comments';

export function start(context: theia.PluginContext) {
    new Comments(context);
    new FtpExplorer(context);

    theia.commands.registerCommand({
        id: 'addComment',
        label: 'Add Comment'
    }, () => theia.window.showInformationMessage('Added'))

    theia.commands.registerCommand({
        id: 'removeComment',
        label: 'Remove'
    }, () => theia.window.showInformationMessage('Removed'))

    theia.commands.registerCommand({
        id: 'copyComment',
        label: 'Copy'
    }, () => theia.window.showInformationMessage('Copied'))
}

export function stop() {
}
