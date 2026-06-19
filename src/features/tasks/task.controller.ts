import type { RequestHandler } from 'express';
import { taskService } from './task.service.js';
import type { taskQuerySchema } from './task.validation.js';
import type { z } from 'zod';

type TaskQuery = z.infer<typeof taskQuerySchema>;

export const listTasks: RequestHandler = async (req, res) => {
  const result = await taskService.list(req.user!, req.validatedQuery as TaskQuery);
  res.json(result);
};

export const getTask: RequestHandler = async (req, res) => {
  const task = await taskService.getById(req.user!, String(req.params.id));
  res.json({ task });
};

export const createTask: RequestHandler = async (req, res) => {
  const task = await taskService.create(req.user!, req.body);
  res.status(201).json({ task });
};

export const updateTask: RequestHandler = async (req, res) => {
  const task = await taskService.update(req.user!, String(req.params.id), req.body);
  res.json({ task });
};

export const updateTaskStatus: RequestHandler = async (req, res) => {
  const task = await taskService.updateStatus(req.user!, String(req.params.id), req.body.status);
  res.json({ task });
};

export const deleteTask: RequestHandler = async (req, res) => {
  await taskService.delete(req.user!, String(req.params.id));
  res.status(204).send();
};

export const taskSummary: RequestHandler = async (_req, res) => {
  const summary = await taskService.summary();
  res.json({ summary });
};
