import {
  date,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 180 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['user', 'admin']).notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

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
