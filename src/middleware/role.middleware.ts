import type { RequestHandler } from 'express';
import type { UserRole } from '../features/users/user.types.js';
import { ApiError } from '../utils/api-error.js';

export const requireRole =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have access to this resource');
    }

    next();
  };
