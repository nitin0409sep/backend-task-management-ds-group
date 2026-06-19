import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema/index.js';
import type { AuthUser } from './user.types.js';

const toAuthUser = (user: typeof users.$inferSelect): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const userService = {
  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  },

  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  },

  async listAssignableUsers() {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .orderBy(users.name);

    return rows;
  },

  toAuthUser,
};
