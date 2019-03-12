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

export const SHELL_TASK_TYPE = 'shell';

const LONG_TASK: theia.Task = {
    name: 'Test task',
    source: SHELL_TASK_TYPE,
    definition: {
        type: SHELL_TASK_TYPE
    },
    execution: {
        command: './task-long-running'
    }
}

export class TaskProvider {
    async provideTasks(): Promise<theia.Task[]> {
        return [LONG_TASK];
    }

    async resolveTask(task: theia.Task): Promise<theia.Task> {
        const execution = task.execution;
        if (execution) {
            execution.options = {
                cwd: path.join(startPoint.getContext().extensionPath, 'resources/')
            }
        }

        return task;
    }
}
