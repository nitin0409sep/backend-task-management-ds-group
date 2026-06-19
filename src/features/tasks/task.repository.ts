import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { tasks, users } from '../../db/schema/index.js';
import { getPagination } from '../../utils/pagination.js';
import type { AuthUser } from '../users/user.types.js';
import type { TaskFilters } from './task.types.js';

const priorityOrder = sql`field(${tasks.priority}, 'low', 'medium', 'high')`;

export const taskRepository = {
  async listForUser(user: AuthUser, filters: TaskFilters) {
    const paging = getPagination(filters.page, filters.limit);
    const conditions = [];

    if (user.role !== 'admin') {
      conditions.push(eq(tasks.assigneeId, user.id));
    }

    if (filters.search) {
      conditions.push(
        or(like(tasks.title, `%${filters.search}%`), like(tasks.description, `%${filters.search}%`)),
      );
    }

    if (filters.status) conditions.push(eq(tasks.status, filters.status));
    if (filters.priority) conditions.push(eq(tasks.priority, filters.priority));

    const orderBy =
      filters.sortBy === 'priority'
        ? filters.sortOrder === 'asc'
          ? asc(priorityOrder)
          : desc(priorityOrder)
        : filters.sortBy === 'dueDate'
          ? filters.sortOrder === 'asc'
            ? asc(tasks.dueDate)
            : desc(tasks.dueDate)
          : filters.sortOrder === 'asc'
            ? asc(tasks.createdAt)
            : desc(tasks.createdAt);

    const rows = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        assigneeId: tasks.assigneeId,
        createdBy: tasks.createdBy,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        assigneeName: users.name,
      })
      .from(tasks)
      .innerJoin(users, eq(users.id, tasks.assigneeId))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(paging.limit)
      .offset(paging.offset);

    return { tasks: rows, page: paging.page, limit: paging.limit };
  },

  async findById(id: string) {
    const [task] = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        assigneeId: tasks.assigneeId,
        createdBy: tasks.createdBy,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        assigneeName: users.name,
      })
      .from(tasks)
      .innerJoin(users, eq(users.id, tasks.assigneeId))
      .where(eq(tasks.id, id))
      .limit(1);

    return task;
  },

  async create(values: typeof tasks.$inferInsert) {
    await db.insert(tasks).values(values);
    return this.findById(values.id);
  },

  async update(id: string, values: Partial<typeof tasks.$inferInsert>) {
    await db.update(tasks).set(values).where(eq(tasks.id, id));
    return this.findById(id);
  },

  async delete(id: string) {
    await db.delete(tasks).where(eq(tasks.id, id));
  },

  async getSummary() {
    const [rows] = await db.execute(sql`CALL sp_get_admin_task_summary()`);
    return rows;
  },
};
