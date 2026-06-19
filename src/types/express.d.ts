import type { AuthUser } from '../features/users/user.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      validatedQuery?: unknown;
    }
  }
}

export {};
