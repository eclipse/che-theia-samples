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
import * as path from 'path';
import * as startPoint from './webview-sample-frontend';
import { TITLE } from './webview-location-manager';

export const PROBLEM_PAGE = 'problemPage';
export const SOLUTION_PAGE: string = 'solutionPage';
export const LEFT_PAGE = 'leftPage';
export const RIGHT_PAGE = 'rightPage';
export const BOTTOM_PAGE = 'bottomPage';

const HEADER = 'Webview panel location';
const CURRENT_STATE_HEADER = 'Current state:';
const CURRENT_STATE_TEXT = 'Only main area can be used for webview panel location';
const PROBLEM_HEADER = 'Problem:';
const PROBLEM_TEXT = "What's about left, right or bottom panels?";
const SOLUTION_HEADER = 'Solution:';
const RIGHT_HEADER = 'Right Area';
const LEFT_HEADER = 'Left Area';
const FINISH_TEXT = "That's all!";
const THANKS_TEXT = 'Thank you!';

export interface Page {
    getHtml(): string;
}

export class TemplatePage {

    getHtml(rendering: string): string {
        const context = startPoint.getContext();
        const scriptPathOnDisk = theia.Uri.file(path.join(context.extensionPath, 'resources', 'webview-location', 'pages.js'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'theia-resource' });

        const cssPathOnDisk = theia.Uri.file(path.join(context.extensionPath, 'resources', 'webview-location', 'pages.css'));
        const cssUri = cssPathOnDisk.with({ scheme: 'theia-resource' });

        return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' *.pixabay.com; script-src 'unsafe-inline' 'self' ;">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" type="text/css" href="${cssUri}">
                    </style>
                    <title>${TITLE}</title>
                </head>
    
                <body>
                  ${rendering}
                  <script src="${scriptUri}"></script>
                </body>
                </html>`;
    }
}

export class ProblemPage implements Page {
    getHtml(): string {
        const template = new TemplatePage();
        return template.getHtml(this.render());
    }

    protected render(): string {
        const imgOnDisk = theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources', 'webview-location', 'tuxProblem.png'));
        const imgURI = imgOnDisk.with({ scheme: 'theia-resource' });

        return `<div class='main-page-container cursor' onclick="changePage('main', '${SOLUTION_PAGE}')">
        <div class='main-page-header-title'>${HEADER}</div>
        <div class='main-page-subheader'>${CURRENT_STATE_HEADER}</div>
        <div class='main-page-content-section'>${CURRENT_STATE_TEXT}</div>
        <div class='main-page-subheader'>${PROBLEM_HEADER}</div>
        <div class='main-page-content-section'>${PROBLEM_TEXT}</div>
        <div class='main-page-problem-image'><img src=${imgURI} height="300" ></div>
    </div>`;
    }
}

export class SolutionPage implements Page {

    getHtml(): string {
        const template = new TemplatePage();
        return template.getHtml(this.render());
    }

    protected render(): string {
        const webviewApiImgOnDisk = theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources', 'webview-location', 'webviewPanelAPI.png'));
        const webviewApiUri = webviewApiImgOnDisk.with({ scheme: 'theia-resource' });

        const showOptionsImgOnDisk = theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources', 'webview-location', 'showOptions.png'));
        const showOptionsUri = showOptionsImgOnDisk.with({ scheme: 'theia-resource' });

        const solutionImgOnDisk = theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources', 'webview-location', 'tuxSolution.png'));
        const solutionUri = solutionImgOnDisk.with({ scheme: 'theia-resource' });

        const enumImgOnDisk = theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources', 'webview-location', 'enum.png'));
        const enumUri = enumImgOnDisk.with({ scheme: 'theia-resource' });
        return `<div class='main-page-container' onclick="changePage('right', '${RIGHT_PAGE}')">
        <div class='main-page-header-title'>${HEADER}</div>
        <div class='main-page-solution-subheader'>${SOLUTION_HEADER}</div>
        <div class='main-page-solution-top-part'><img src=${webviewApiUri} height="250"></div>
        <div class='main-page-solution-bottom-part'>
            <div><img src=${showOptionsUri} height="350"></div>
            <div><img src=${solutionUri} height="350"></div>
            <div><img src=${enumUri} height="350"></div>
        </div>
    </div>`;
    }
}

export class RightPage implements Page {

    getHtml(): string {
        const template = new TemplatePage();
        return template.getHtml(this.render());
    }

    protected render(): string {
        const tuxRightImgOnDisk = theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources', 'webview-location', 'tuxRight.png'));
        const tuxRightUri = tuxRightImgOnDisk.with({ scheme: 'theia-resource' });

        return `<div class='main-page-container' onclick="changePage('left', '${LEFT_PAGE}')">
        <div class='right-page-header'>${RIGHT_HEADER}</div>
        <div class='right-page-image'><img src=${tuxRightUri} height="350"></div>
    </div>`;
    }
}

export class LeftPage implements Page {

    getHtml(): string {
        const template = new TemplatePage();
        return template.getHtml(this.render());
    }

    protected render(): string {
        const tuxLeftImgOnDisk = theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources', 'webview-location', 'tuxLeft.png'));
        const tuxLeftUri = tuxLeftImgOnDisk.with({ scheme: 'theia-resource' });

        return `<div class='main-page-container' onclick="changePage('bottom', '${BOTTOM_PAGE}')">
        <div class='right-page-header'>${LEFT_HEADER}</div>
        <div class='right-page-image'><img src=${tuxLeftUri} height="250"></div>
    </div>`;
    }
}

export class BottomPage implements Page {
    getHtml(): string {
        const template = new TemplatePage();
        return template.getHtml(this.render());
    }

    protected render(): string {
        const imgOnDisk = theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources', 'webview-location', 'tuxSleep.png'));
        const imgURI = imgOnDisk.with({ scheme: 'theia-resource' });

        return `<div class='main-page-container' onclick="changePage('main', '${PROBLEM_PAGE}')">
        <div class='bottom-page'>
            <div class='bottom-page-subheader'>${FINISH_TEXT}</div>
            <div class='main-page-problem-image'><img src=${imgURI} height="200"></div>
            <div class='bottom-page-subheader'>${THANKS_TEXT}</div>
        </div>
    </div>`;
    }
}
