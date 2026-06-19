import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db, closeDb } from './index.js';
import { tasks, users } from './schema/index.js';
import { hashPassword } from '../utils/password.js';

const upsertUser = async (email: string, name: string, role: 'user' | 'admin') => {
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return existing;

  const id = randomUUID();
  await db.insert(users).values({
    id,
    name,
    email,
    role,
    passwordHash: await hashPassword('Password@123'),
  });

  const [created] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return created;
};

const run = async () => {
  const admin = await upsertUser('admin@admin.com', 'Admin User', 'admin');
  const user = await upsertUser('user@user.com', 'Demo User', 'user');

  const [existingTask] = await db.select().from(tasks).limit(1);
  if (!existingTask) {
    await db.insert(tasks).values([
      {
        id: randomUUID(),
        title: 'Prepare task dashboard',
        description: 'Wire filters, sorting and responsive states.',
        status: 'in_progress',
        priority: 'high',
        assigneeId: user.id,
        createdBy: admin.id,
        dueDate: new Date('2026-07-05T00:00:00.000Z'),
      },
      {
        id: randomUUID(),
        title: 'Review API documentation',
        status: 'todo',
        priority: 'medium',
        assigneeId: user.id,
        createdBy: admin.id,
      },
    ]);
  }
};

run()
  .then(async () => {
    await closeDb();
  })
  .catch(async (error) => {
    console.error(error);
    await closeDb();
    process.exit(1);
  });
