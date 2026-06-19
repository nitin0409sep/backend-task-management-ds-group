import type { ErrorRequestHandler } from 'express';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/api-error.js';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message, errors: error.errors });
    return;
  }

  logger.error('Unhandled request error', error);
  res.status(500).json({ message: 'Something went wrong' });
};
