import { isNativeError } from 'node:util/types';

import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';

import { INTERNAL_SERVER_ERROR } from '@/constants/errors.constant';
import { ApiError } from '@/utils/apiError';
import { DatabaseError } from '@/utils/databaseError';
import formatZodError from '@/utils/formatZodError';
import { RateLimitterError } from '@/utils/rateLimitterError';

export default function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    isNativeError(err);

    if (err instanceof ZodError) {
        return res.status(httpStatus.BAD_REQUEST).json(formatZodError(err));
    }
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    if (err instanceof DatabaseError) {
        return res.status(err.status).json({ message: err.message });
    }
    if (err instanceof RateLimitterError) {
        return res.status(err.status).json({ message: err.message });
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR });
}
