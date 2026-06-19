import { z } from 'zod';

const today = () => new Date().toISOString().slice(0, 10);
const isTodayOrFuture = (value: string) => value >= today();

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'done']);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

export const taskIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const emptyStringToUndefined = (value: unknown) => (value === '' ? undefined : value);

export const taskQuerySchema = z.object({
  search: z.preprocess(emptyStringToUndefined, z.string().trim().max(160).optional()),
  status: z.preprocess(emptyStringToUndefined, taskStatusSchema.optional()),
  priority: z.preprocess(emptyStringToUndefined, taskPrioritySchema.optional()),
  sortBy: z.preprocess(emptyStringToUndefined, z.enum(['createdAt', 'priority', 'dueDate']).optional()),
  sortOrder: z.preprocess(emptyStringToUndefined, z.enum(['asc', 'desc']).optional()),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
});

const taskFields = {
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(1).max(2000),
  status: taskStatusSchema.default('todo'),
  priority: taskPrioritySchema.default('medium'),
  assigneeId: z.string().uuid(),
};

export const createTaskSchema = z.object({
  ...taskFields,
  dueDate: z.string().date().refine(isTodayOrFuture, 'Due date cannot be in the past'),
});

export const updateTaskSchema = z.object({
  ...taskFields,
  dueDate: z.string().date(),
}).partial();

export const updateTaskStatusSchema = z.object({
  status: taskStatusSchema,
});
