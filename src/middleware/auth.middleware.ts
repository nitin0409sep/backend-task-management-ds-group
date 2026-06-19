import type { RequestHandler } from 'express';
import { userService } from '../features/users/user.service.js';
import { ApiError } from '../utils/api-error.js';
import { verifyToken } from '../utils/jwt.js';

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  try {
    const payload = verifyToken(token);
    const user = await userService.findById(payload.userId);

    if (!user) {
      throw new ApiError(401, 'Authentication required');
    }

    req.user = userService.toAuthUser(user);
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Authentication required');
  }
};
