import type { RequestHandler } from 'express';
import os from 'os';

import { AppDataSource } from '@/configs/database';
import { NodeEnv } from '@/enums/nodeEnv.enum';

export const healthCheck: RequestHandler = async (_, res) => {
    await AppDataSource.query('SELECT NOW();');

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;

    const response = {
        // Runtime metrics
        uptime: Math.floor(process.uptime()),
        timestamp: Date.now(),
        memory: {
            total: `${(totalMemory / 1024 ** 3).toFixed(2)} GB`,
            used: `${(usedMemory / 1024 ** 3).toFixed(2)} GB`,
            free: `${(freeMemory / 1024 ** 3).toFixed(2)} GB`,
            usage: `${memoryUsage.toFixed(2)}%`,
        },

        // Version information
        versions: {
            node: process.version,
            commit: process.env.COMMIT_ID ?? 'local',
        },

        // Environment details
        environment: {
            nodeEnv: process.env.NODE_ENV ?? NodeEnv.LOCAL,
        },

        // External Services
        service: {
            status: 'healthy',
        },
    };
    return res.status(200).json(response);
};
