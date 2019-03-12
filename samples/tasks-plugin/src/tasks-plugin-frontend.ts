/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

/**
 * Generated using theia-plugin-generator
 */

import * as theia from '@theia/plugin';
import { TaskProvider, SHELL_TASK_TYPE } from './task-provider';
import { TaskExecutionsManager } from './task-executions-manager';

const taskExecutionsManager = new TaskExecutionsManager();

export const STATUS_BAR_TASKS = {
    id: 'show.active.tasks',
    label: 'Show active tasks',
    title: 'Tasks'
};

let context: theia.PluginContext;
let subscriptions: { dispose(): any }[];

export function start(pluginContext: theia.PluginContext) {
    context = pluginContext;
    subscriptions = context.subscriptions;

    // Provides tasks
    const taskProviderDisposable = theia.tasks.registerTaskProvider(SHELL_TASK_TYPE, new TaskProvider());
    subscriptions.push(taskProviderDisposable);

    subscribe();
    setStatusBarTasksItem();
}

/** Listening to events for a task execution starting and completion of an executed task */
function subscribe() {
    const startTaskDisposable = theia.tasks.onDidStartTask(event => {
        taskExecutionsManager.showExecutions();

        const task = event.execution.task;
        console.log(`The task ${task.name} was started`);
    });

    const endTaskDisposable = theia.tasks.onDidEndTask(event => {
        taskExecutionsManager.showExecutions();

        const task = event.execution.task;
        console.log(`The task ${task.name} was terminated`);
    });

    subscriptions.push(startTaskDisposable);
    subscriptions.push(endTaskDisposable);
}

async function setStatusBarTasksItem() {
    theia.commands.registerCommand(STATUS_BAR_TASKS, () => {
        taskExecutionsManager.showExecutions();
    });

    const item = await theia.window.createStatusBarItem(theia.StatusBarAlignment.Left);
    item.text = STATUS_BAR_TASKS.title;
    item.tooltip = STATUS_BAR_TASKS.label;
    item.command = STATUS_BAR_TASKS.id;
    item.show();
}

export function getContext(): theia.PluginContext {
    return context;
}

export function stop() {

}
