/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as theia from '@theia/plugin';
import * as fs from 'fs';
import * as path from 'path';
export const YEARS_IDENTIFIER = '${Years}';
export const AUTHORS_IDENTIFIER = '${Authors}';

export const MIT_LICENSE_HEADER_CONTENT = `/*\n* Copyright (c) ${YEARS_IDENTIFIER}${AUTHORS_IDENTIFIER}. All rights reserved.\n* @license MIT\n*/\n`;
export const MIT_LICENSE_HEDER_REGEXP = new RegExp(/.*(Copyright \(c\) ).*(. All rights reserved.\n).*(@license MIT\n).*/);

export const PACKAGE_JSON = 'package.json';

export const SUPPORTED_EXTENSIONS = ['.js', '.ts'];
export const SUPPORTED_LICENCE_HEADERS = ['MIT'];

export class LicenseHeader {

    constructor(private readonly authors: string, private readonly licenseContent: string, private readonly licenceRegexp: RegExp) { }

    getHeader(): string {
        const currentYear = new Date().getFullYear();
        const spaceAfterYear = this.authors ? ' ' : '';
        const header = this.licenseContent.replace(YEARS_IDENTIFIER, currentYear + spaceAfterYear).replace(AUTHORS_IDENTIFIER, this.authors || '');
        return header;
    }

    getRegExpr(): RegExp {
        return this.licenceRegexp;
    }
}

export function start(context: theia.PluginContext) {
    context.subscriptions.push(theia.workspace.onWillSaveTextDocument(fileSaveEvent => {
        const fileContentPromise = new Promise<void | theia.TextEdit[]>((resolve, reject) => {
            const fileExt = path.extname(fileSaveEvent.document.uri.fsPath);
            if (!SUPPORTED_EXTENSIONS.find((supportedExt => supportedExt === fileExt))) {
                resolve([]);
            }
            const fileUri = fileSaveEvent.document.uri;
            const workspaceFolder: theia.WorkspaceFolder | theia.Uri | undefined = theia.workspace.getWorkspaceFolder(fileUri);
            let workspaceFolderUri: theia.Uri | undefined;
            if (workspaceFolder) {
                workspaceFolderUri = workspaceFolder instanceof theia.Uri ? workspaceFolder : workspaceFolder.uri;
            }

            if (workspaceFolderUri) {
                const packageJsonPath = path.resolve(workspaceFolderUri.fsPath, PACKAGE_JSON);
                if (fs.existsSync(packageJsonPath)) {
                    const packageJson = require(packageJsonPath);

                    if (packageJson.license && isSupportedValue(packageJson.license, SUPPORTED_LICENCE_HEADERS)) {
                        const document = getDocument(fileSaveEvent.document.uri);
                        if (document) {
                            const fileText = document.getText();

                            const textEdits: theia.TextEdit[] = [];
                            const mitLicenceHeader = new LicenseHeader(packageJson.author, MIT_LICENSE_HEADER_CONTENT, MIT_LICENSE_HEDER_REGEXP);

                            if (!mitLicenceHeader.getRegExpr().test(fileText)) {
                                const licenceHeaderEdit = theia.TextEdit.insert(document.lineAt(0).range.start, mitLicenceHeader.getHeader());
                                textEdits.push(licenceHeaderEdit);
                            }
                            resolve(textEdits);
                        }
                    }
                }
            }
            resolve();
        });

        fileSaveEvent.waitUntil(fileContentPromise);
    }));
}

function isSupportedValue(item: string, supportedElems: string[]): boolean {
    return supportedElems.findIndex((supportedElem => supportedElem === item)) >= 0;
}

function getDocument(fileUri: theia.Uri): theia.TextDocument | undefined {
    return theia.workspace.textDocuments.find((document: theia.TextDocument) => {
        if (document.uri === fileUri) {
            return true;
        }
        return false;
    });
}

export function stop() {
}
