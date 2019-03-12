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
import * as startPoint from './tasks-plugin-frontend';
import { TASKS_TITLE, PLACEHOLDER, TERMINATE_BUTTON_NAME } from './task-executions-manager';

export class ActiveTasksWidget {

    constructor(protected readonly tasks: ReadonlyArray<theia.TaskExecution>) { }

    getHtml(): string {
        const context = startPoint.getContext();
        const scriptPathOnDisk = theia.Uri.file(path.join(context.extensionPath, 'resources', 'tasks.js'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'theia-resource' });

        const cssPathOnDisk = theia.Uri.file(path.join(context.extensionPath, 'resources', 'tasks.css'));
        const cssUri = cssPathOnDisk.with({ scheme: 'theia-resource' });

        const rendering = this.render();
        return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; script-src 'unsafe-inline' 'self' ;">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" type="text/css" href="${cssUri}">
                    </style>
                    <title>${TASKS_TITLE}</title>
                </head>
    
                <body>
                  ${rendering}
                  <script src="${scriptUri}"></script>
                </body>
                </html>`;
    }

    private render(): string {
        if (this.tasks.length < 1) {
            return `<div class='tasks-placeholder'>${PLACEHOLDER}</div>`;
        }

        const tasks = this.renderTasks().join('');
        return `<div class='tasks-container'>${tasks}</div>`;
    }

    private renderTasks(): Array<string> {
        return this.tasks.map((taskExecution) => {
            const task = taskExecution.task;
            const execution = task.execution;
            const command = execution ? (<theia.ShellExecution>execution).command : '';

            const type = `<lable>${task.definition.type}</label>`;
            const taskLabel = `<lable>${task.name}</label>`;
            const commandLabel = `<lable>${command}</label>`;
            const terminateButton = `<button class='button' type="button" onclick="terminateTask(${task.definition.id})">${TERMINATE_BUTTON_NAME}</button>`;

            return this.renderTemplate(type, taskLabel, commandLabel, terminateButton);
        });
    }

    private renderTemplate(taskType: string, taskLabel: string, command: string, terminateButton: string) {
        return `<div class='task'>
                    <div class='tasks-labels-part'>
                            <div class='label'>
                                ${taskType}
                            </div>
                            <div class='label'>
                                ${taskLabel}
                            </div>
                            <div class='label'>
                                ${command}
                            </div>
                    </div>
                    <div class='tasks-buttons-part'>
                            <div class='button'>
                                ${terminateButton}
                            </div>
                    </div>
                </div>`;
    }
}
