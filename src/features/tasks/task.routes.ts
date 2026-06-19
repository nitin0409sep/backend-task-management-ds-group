import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  taskSummary,
  updateTask,
  updateTaskStatus,
} from './task.controller.js';
import {
  createTaskSchema,
  taskIdParamsSchema,
  taskQuerySchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from './task.validation.js';

export const taskRoutes = Router();

taskRoutes.use(requireAuth);
taskRoutes.get('/', validate({ query: taskQuerySchema }), asyncHandler(listTasks));
taskRoutes.get('/summary', requireRole('admin'), asyncHandler(taskSummary));
taskRoutes.get('/:id', validate({ params: taskIdParamsSchema }), asyncHandler(getTask));
taskRoutes.post('/', requireRole('admin'), validate({ body: createTaskSchema }), asyncHandler(createTask));
taskRoutes.patch(
  '/:id/status',
  validate({ params: taskIdParamsSchema, body: updateTaskStatusSchema }),
  asyncHandler(updateTaskStatus),
);
taskRoutes.put(
  '/:id',
  requireRole('admin'),
  validate({ params: taskIdParamsSchema, body: updateTaskSchema }),
  asyncHandler(updateTask),
);
taskRoutes.delete('/:id', requireRole('admin'), validate({ params: taskIdParamsSchema }), asyncHandler(deleteTask));
