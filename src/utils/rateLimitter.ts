import type { NextFunction, Request, Response } from 'express';

import { validatedEnv } from '@/configs/env';
import { getRedisClient } from '@/configs/redis';
import { IP_NOT_FOUND_ERROR, TOO_MANY_REQUESTS } from '@/constants/errors.constant';

import { ApiError } from './apiError';
import { RateLimitterError } from './rateLimitterError';

// Custom rate limiter middleware
const rateLimiter = async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.ip) {
        throw new ApiError(IP_NOT_FOUND_ERROR);
    }
    const redis = getRedisClient();

    const ip = req.ip;
    const timeWindowSeconds = 15 * 60; // 15 minutes
    const maxRequests = validatedEnv.MAX_REQUEST_PER_WINDOW;
    const key = `rate_limit:${ip}`;

    // Increment request count
    const requestCount = await redis.incr(key);

    // If this is the first request, set expiry for the counter
    if (requestCount === 1) {
        await redis.expire(key, timeWindowSeconds);
    }

    // If over the limit, throw error
    if (requestCount > maxRequests) {
        throw new RateLimitterError(TOO_MANY_REQUESTS);
    }

    next();
};
export default rateLimiter;
