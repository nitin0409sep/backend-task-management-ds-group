import { randomUUID } from 'node:crypto';
import { db } from '../../db/index.js';
import { users } from '../../db/schema/index.js';
import { ApiError } from '../../utils/api-error.js';
import { signToken } from '../../utils/jwt.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { userService } from '../users/user.service.js';
import type { loginSchema, registerSchema } from './auth.validation.js';
import type { z } from 'zod';

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userService.findByEmail(input.email);
    if (existing) {
      throw new ApiError(409, 'Email is already registered');
    }

    const id = randomUUID();

    await db.insert(users).values({
      id,
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      role: 'user',
    });

    const user = await userService.findById(id);
    if (!user) {
      throw new ApiError(500, 'User could not be created');
    }

    const authUser = userService.toAuthUser(user);
    return {
      user: authUser,
      token: signToken({ userId: authUser.id, role: authUser.role }),
    };
  },

  async login(input: LoginInput) {
    const user = await userService.findByEmail(input.email);
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const authUser = userService.toAuthUser(user);
    return {
      user: authUser,
      token: signToken({ userId: authUser.id, role: authUser.role }),
    };
  },
};
