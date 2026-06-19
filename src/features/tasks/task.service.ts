import { randomUUID } from 'node:crypto';
import { ApiError } from '../../utils/api-error.js';
import type { AuthUser } from '../users/user.types.js';
import { userService } from '../users/user.service.js';
import { taskRepository } from './task.repository.js';
import type { createTaskSchema, taskQuerySchema, taskStatusSchema, updateTaskSchema } from './task.validation.js';
import type { z } from 'zod';

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
type TaskQuery = z.infer<typeof taskQuerySchema>;
type TaskStatus = z.infer<typeof taskStatusSchema>;

const canUseTask = (user: AuthUser, task: { assigneeId: string; createdBy: string }) =>
  user.role === 'admin' || task.assigneeId === user.id || task.createdBy === user.id;

const canUpdateStatus = (user: AuthUser, task: { assigneeId: string }) =>
  user.role === 'admin' || task.assigneeId === user.id;

const toDate = (value?: string) => (value ? new Date(value + 'T00:00:00.000Z') : undefined);

export const taskService = {
  list(user: AuthUser, query: TaskQuery) {
    return taskRepository.listForUser(user, query);
  },

  async getById(user: AuthUser, id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new ApiError(404, 'Task not found');
    if (!canUseTask(user, task)) throw new ApiError(403, 'You do not have access to this task');

    return task;
  },

  async create(user: AuthUser, input: CreateTaskInput) {
    const assigneeId = user.role === 'admin' ? input.assigneeId : user.id;

    if (user.role === 'admin' && assigneeId === user.id) {
      throw new ApiError(400, 'Admins cannot assign tasks to themselves');
    }

    const assignee = await userService.findById(assigneeId);

    if (!assignee) {
      throw new ApiError(400, 'Assignee does not exist');
    }

    const task = await taskRepository.create({
      id: randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      assigneeId,
      createdBy: user.id,
      dueDate: toDate(input.dueDate),
    });

    return task;
  },

  async update(user: AuthUser, id: string, input: UpdateTaskInput) {
    const task = await taskRepository.findById(id);
    if (!task) throw new ApiError(404, 'Task not found');
    if (!canUseTask(user, task)) throw new ApiError(403, 'You do not have access to this task');

    if (input.assigneeId && user.role !== 'admin') {
      throw new ApiError(403, 'Only admins can assign tasks');
    }

    if (user.role === 'admin' && input.assigneeId === user.id) {
      throw new ApiError(400, 'Admins cannot assign tasks to themselves');
    }

    if (input.assigneeId && !(await userService.findById(input.assigneeId))) {
      throw new ApiError(400, 'Assignee does not exist');
    }

    const updateValues = {
      ...input,
      dueDate: input.dueDate === undefined ? undefined : toDate(input.dueDate),
    };

    return taskRepository.update(id, updateValues);
  },

  async updateStatus(user: AuthUser, id: string, status: TaskStatus) {
    const task = await taskRepository.findById(id);
    if (!task) throw new ApiError(404, 'Task not found');
    if (!canUpdateStatus(user, task)) throw new ApiError(403, 'You do not have access to update this task status');

    return taskRepository.update(id, { status });
  },

  async delete(user: AuthUser, id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new ApiError(404, 'Task not found');
    if (!canUseTask(user, task)) throw new ApiError(403, 'You do not have access to this task');

    await taskRepository.delete(id);
  },

  summary() {
    return taskRepository.getSummary();
  },
};
