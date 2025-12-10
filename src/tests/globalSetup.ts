import 'tsconfig-paths/register';

import { DataSource } from 'typeorm';

import { connectDB } from '@/configs/database';
import { validatedEnv } from '@/configs/env';

export default async () => {
    const adminDataSource = new DataSource({
        type: 'postgres',
        host: validatedEnv.DATABASE_HOST,
        port: validatedEnv.DATABASE_PORT,
        username: validatedEnv.DATABASE_USER,
        password: validatedEnv.DATABASE_PASSWORD,
        database: 'postgres',
    });
    try {
        await adminDataSource.initialize();
    } finally {
        await adminDataSource.destroy();
    }
    await connectDB();
};
