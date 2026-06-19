import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import { validate } from '../../middleware/validate.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { login, me, register } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.validation.js';

export const authRoutes = Router();

authRoutes.post('/register', validate({ body: registerSchema }), asyncHandler(register));
authRoutes.post('/login', validate({ body: loginSchema }), asyncHandler(login));
authRoutes.get('/me', requireAuth, me);
