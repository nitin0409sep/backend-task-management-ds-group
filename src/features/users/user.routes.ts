import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { listUsers } from './user.controller.js';

export const userRoutes = Router();

userRoutes.get('/', requireAuth, requireRole('admin'), asyncHandler(listUsers));
