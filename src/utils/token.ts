import httpStatus from 'http-status';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { validatedEnv } from '@/configs/env';
import { INVALID_TOKEN, USER_UNAUTHORISED } from '@/constants/errors.constant';

import { ApiError } from './apiError';

export const generateTokens = (userId: number) => {
    const refreshToken = jwt.sign({ userId }, validatedEnv.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
    const accessToken = jwt.sign({ userId }, validatedEnv.JWT_ACCESS_SECRET, {
        expiresIn: '10m',
    });
    return { refreshToken, accessToken };
};

// Type guard for JwtPayload with userId
function isJwtPayloadWithUserId(payload: unknown): payload is JwtPayload & { userId: number } {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'userId' in payload &&
        typeof (payload as JwtPayload).userId === 'number'
    );
}

export const getAccessToken = (refreshToken: string) => {
    try {
        const payload = jwt.verify(refreshToken, validatedEnv.JWT_REFRESH_SECRET);

        if (!isJwtPayloadWithUserId(payload)) {
            throw new ApiError(INVALID_TOKEN, httpStatus.UNAUTHORIZED);
        }

        const accessToken = jwt.sign({ userId: payload.userId }, validatedEnv.JWT_ACCESS_SECRET, { expiresIn: '10m' });

        return { accessToken };
    } catch (_) {
        throw new ApiError(USER_UNAUTHORISED, httpStatus.UNAUTHORIZED);
    }
};
