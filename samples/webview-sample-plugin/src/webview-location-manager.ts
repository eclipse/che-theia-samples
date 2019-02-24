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
import { ProblemPage, SolutionPage, PROBLEM_PAGE, Page, SOLUTION_PAGE, RIGHT_PAGE, RightPage, LEFT_PAGE, LeftPage, BottomPage, BOTTOM_PAGE } from './pages';

const STATUS_BAR_WEBVIEW_PANEL = {
    id: 'show.main.webview.panel',
    label: 'Show main webview panel',
    title: 'Webview'
};

export const TITLE = 'Webview-location-sample';
export const WEBVIEW_VIEW_TYPE = 'WebviewLocation';

export class WebviewLocationManager {

    private currentPanel: theia.WebviewPanel | undefined;

    constructor() {
        this.setStatusBarItem();
    }


    showPage(area: theia.WebviewPanelTargetArea, pageId: string) {
        if (this.currentPanel) {
            this.currentPanel.dispose();
        }

        // TODO improve webview panel update way 
        // depends on https://github.com/theia-ide/theia/issues/4342 and https://github.com/theia-ide/theia/issues/4339
        const context = startPoint.getContext();
        if (!this.currentPanel) {
            this.currentPanel = theia.window.createWebviewPanel(WEBVIEW_VIEW_TYPE, TITLE, { area }, {
                enableScripts: true,
                localResourceRoots: [
                    theia.Uri.file(path.join(context.extensionPath, 'resources')),
                    theia.Uri.file(path.join(context.extensionPath, 'node_modules/@fortawesome'))
                ]
            });
        }

        const page = this.createPage(pageId);
        this.currentPanel.webview.html = page.getHtml();

        this.currentPanel.webview.onDidReceiveMessage(
            (message: any) => {
                switch (message.command) {
                    case 'changePage':
                        this.showPage(this.toArea(message.area), message.pageId)
                        return;
                }
            },
            undefined,
            context.subscriptions
        );

        this.currentPanel.onDidDispose(() => {
            this.currentPanel = undefined;
        },
            undefined,
            context.subscriptions);
    }

    private createPage(pageId: string): Page {
        switch (pageId) {
            case PROBLEM_PAGE:
                return new ProblemPage();
            case SOLUTION_PAGE:
                return new SolutionPage();
            case LEFT_PAGE:
                return new LeftPage();
            case RIGHT_PAGE:
                return new RightPage();
            case BOTTOM_PAGE:
                return new BottomPage();
            default:
                return new ProblemPage();
        }
    }

    private async setStatusBarItem() {
        theia.commands.registerCommand(STATUS_BAR_WEBVIEW_PANEL, () => {
            this.showPage(this.toArea('main'), PROBLEM_PAGE);
        });

        const item = await theia.window.createStatusBarItem(theia.StatusBarAlignment.Left);
        item.text = STATUS_BAR_WEBVIEW_PANEL.title;
        item.tooltip = STATUS_BAR_WEBVIEW_PANEL.label;
        item.command = STATUS_BAR_WEBVIEW_PANEL.id;
        item.show();
    }

    private toArea(area: string): theia.WebviewPanelTargetArea {
        switch (area) {
            case 'left':
                return theia.WebviewPanelTargetArea.Left;
            case 'right':
                return theia.WebviewPanelTargetArea.Right;
            case 'bottom':
                return theia.WebviewPanelTargetArea.Bottom;
            default:
                return theia.WebviewPanelTargetArea.Main;
        }
    }
}
