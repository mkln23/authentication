import type { NextFunction } from 'express';
import httpStatus from 'http-status';
import request from 'supertest';

import { ApiRoutes } from '@/constants/apiRoutes.constant';
import app from '@/server';

jest.mock('@/utils/rateLimitter', () => ({
    __esModule: true,
    default: jest.fn((_req, _res, next: NextFunction) => {
        next();
    }),
}));

const HEALTH_CHECK_URL = `${ApiRoutes.API_BASE}${ApiRoutes.HEALTH}`;

describe('Health Check', () => {
    describe('Successful health check', () => {
        it('should return a 200 status with a healthy message', async () => {
            const response = await request(app).get(HEALTH_CHECK_URL);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toHaveProperty('uptime');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('memory');

            expect(response.body.memory).toHaveProperty('total');
            expect(response.body.memory).toHaveProperty('used');
            expect(response.body.memory).toHaveProperty('free');
            expect(response.body.memory).toHaveProperty('usage');

            expect(response.body).toHaveProperty('versions');
            expect(response.body.versions).toHaveProperty('node');
            expect(response.body.versions).toHaveProperty('commit');

            expect(response.body).toHaveProperty('environment');
            expect(response.body.environment).toHaveProperty('nodeEnv');

            expect(response.body).toHaveProperty('service');
            expect(response.body.service).toHaveProperty('status');

            expect(response.body.service.status).toBe('healthy');
        });
    });
});
