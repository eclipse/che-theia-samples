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
import * as startPoint from './tasks-plugin-frontend';
import * as path from 'path';
import { ActiveTasksWidget } from './tasks-widget';

export const TASKS_TITLE = 'Active Tasks';
export const TASKS_VIEW_TYPE = 'ActiveTasksView';
export const TERMINATE_BUTTON_NAME = 'Terminate';
export const PLACEHOLDER = 'No tasks are running';

export class TaskExecutionsManager {
    private id: number = -1;
    private currentPanel: theia.WebviewPanel | undefined;
    private readonly executions: Map<number, theia.TaskExecution> = new Map();

    showExecutions() {
        const taskExecutions = theia.tasks.taskExecutions;
        taskExecutions.forEach(item => {
            const id = ++this.id;
            item.task.definition.id = id;
            this.executions.set(id, item);
        });

        const context = startPoint.getContext();
        const tasksWidget = new ActiveTasksWidget(taskExecutions);

        const panel = this.providePanel();
        panel.webview.html = tasksWidget.getHtml();
        panel.webview.onDidReceiveMessage(message => this.onMessageReceived(message), undefined, context.subscriptions);
        panel.onDidDispose(() => { this.currentPanel = undefined; }, undefined, context.subscriptions);
    }

    private onMessageReceived(message: any) {
        if (message.command !== 'terminateTask') {
            return;
        }

        const taskId = message.taskId;
        const execution = this.executions.get(taskId)

        if (execution) {
            execution.terminate();
            this.executions.delete(taskId);
        }
    }

    private providePanel(): theia.WebviewPanel {
        if (this.currentPanel) {
            //TODO improve way of updating webview panel
            // depends on https://github.com/theia-ide/theia/issues/4342 and https://github.com/theia-ide/theia/issues/4339
            this.currentPanel.dispose();
        }

        return this.currentPanel = theia.window.createWebviewPanel(TASKS_VIEW_TYPE, TASKS_TITLE, { area: theia.WebviewPanelTargetArea.Bottom }, {
            enableScripts: true,
            localResourceRoots: [theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources'))]
        });
    }
}
