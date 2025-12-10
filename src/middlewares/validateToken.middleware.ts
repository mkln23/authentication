import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import { validatedEnv } from '@/configs/env';
import { INVALID_TOKEN, TOKEN_MISSING, userDoesNotExistWithGivenKey } from '@/constants/errors.constant';
import { USERID } from '@/schema/pathParam.schema';
import { AuthService } from '@/services/auth.service';
import { ApiError } from '@/utils/apiError';

export const validateToken = async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(TOKEN_MISSING, httpStatus.UNAUTHORIZED);
    }
    const token = authHeader.split(' ')[1];
    try {
        const jwtClaim = jwt.verify(token, validatedEnv.JWT_ACCESS_SECRET);
        if (typeof jwtClaim === 'string' || !('userId' in jwtClaim)) {
            throw new ApiError(INVALID_TOKEN, httpStatus.UNAUTHORIZED);
        }

        const user = await AuthService.getUserById(+jwtClaim.userId);
        if (!user) {
            throw new ApiError(userDoesNotExistWithGivenKey(USERID), httpStatus.NOT_FOUND);
        }

        req.user = user;
    } catch (_) {
        throw new ApiError(INVALID_TOKEN, httpStatus.UNAUTHORIZED);
    }

    next();
};
