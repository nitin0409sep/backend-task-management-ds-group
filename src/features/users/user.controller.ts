import type { RequestHandler } from 'express';
import { userService } from './user.service.js';

export const listUsers: RequestHandler = async (_req, res) => {
  const users = await userService.listAssignableUsers();
  res.json({ users });
};
