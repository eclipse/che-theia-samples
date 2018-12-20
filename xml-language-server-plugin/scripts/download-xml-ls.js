/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

// @ts-check
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// @ts-ignore
const packagePath = path.join(__dirname, '..');
let downloadUrl = 'https://github.com/angelozerr/lsp4xml/releases/download/v0.0.2/org.eclipse.lsp4xml-all.jar';
const downloadDir = 'lsp4xml';
const filename = 'org.eclipse.lsp4xml-all.jar';
const downloadPath = path.join(packagePath, downloadDir);
const archivePath = path.join(downloadPath, filename);

function downloadXMLServer() {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(archivePath)) {
            resolve();
            return;
        }
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }
        const file = fs.createWriteStream(archivePath);
        const downloadWithRedirect = url => {
            /** @type { any } */
            const h = url.toString().startsWith('https') ? https : http;
            h.get(url, response => {
                const statusCode = response.statusCode;
                const redirectLocation = response.headers.location;
                if (statusCode >= 300 && statusCode < 400 && redirectLocation) {
                    console.log('Redirect location: ' + redirectLocation);
                    downloadWithRedirect(redirectLocation);
                } else if (statusCode === 200) {
                    response.on('end', () => resolve());
                    response.on('error', e => {
                        file.destroy();
                        reject(e);
                    });
                    response.pipe(file);
                } else {
                    file.destroy();
                    reject(new Error(`Failed to download XML LS with code: ${statusCode}`));
                }
            })

        };
        downloadWithRedirect(downloadUrl);
    });
}

downloadXMLServer().catch(error => {
    console.error(error);
});
