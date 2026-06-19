import { relations } from 'drizzle-orm';
import {
  date,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema.js';

export const tasks = mysqlTable(
  'tasks',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    title: varchar('title', { length: 160 }).notNull(),
    description: text('description'),
    status: mysqlEnum('status', ['todo', 'in_progress', 'done']).notNull().default('todo'),
    priority: mysqlEnum('priority', ['low', 'medium', 'high']).notNull().default('medium'),
    assigneeId: varchar('assignee_id', { length: 36 })
      .notNull()
      .references(() => users.id),
    createdBy: varchar('created_by', { length: 36 })
      .notNull()
      .references(() => users.id),
    dueDate: date('due_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    assigneeIdx: index('tasks_assignee_idx').on(table.assigneeId),
    statusIdx: index('tasks_status_idx').on(table.status),
    dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
  }),
);

export const taskRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
  }),
}));

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
