import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/api-error.js';

type RequestSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validate =
  (schemas: RequestSchemas): RequestHandler =>
  (req, _res, next) => {
    const result = {
      body: schemas.body?.safeParse(req.body),
      params: schemas.params?.safeParse(req.params),
      query: schemas.query?.safeParse(req.query),
    };

    for (const parsed of Object.values(result)) {
      if (parsed && !parsed.success) {
        throw new ApiError(400, 'Validation failed', parsed.error.flatten());
      }
    }

    if (result.body?.success) req.body = result.body.data;
    if (result.params?.success) req.params = result.params.data;
    if (result.query?.success) req.validatedQuery = result.query.data;

    next();
  };
