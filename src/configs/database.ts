import 'reflect-metadata';

import path from 'node:path';

import { Client } from 'pg';
import { DataSource } from 'typeorm';

import { validatedEnv } from './env';

const basePath = path.join(__dirname, '..', 'database');
const modelsGlob = path.join(basePath, 'entities/**/*.{js,ts}');
const migrationsGlob = path.join(basePath, 'migrations/**/*.{js,ts}');

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: validatedEnv.DATABASE_HOST,
//   port: validatedEnv.DATABASE_PORT,
//   username: validatedEnv.DATABASE_USER,
//   password: validatedEnv.DATABASE_PASSWORD,
//   database: validatedEnv.DATABASE_NAME,
//   synchronize: false,
//   logging: false,
//   useUTC: true,
//   entities: [modelsGlob],
//   migrations: [migrationsGlob],
//   subscribers: [],
//   extra: {
//     connectionLimit: validatedEnv.DATABASE_CONNECTION_LIMIT,
//   },
// });

const isCompiled = path.extname(__filename) === '.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: validatedEnv.DATABASE_HOST,
    port: validatedEnv.DATABASE_PORT,
    username: validatedEnv.DATABASE_USER,
    password: validatedEnv.DATABASE_PASSWORD,
    database: validatedEnv.DATABASE_NAME,
    synchronize: false,
    logging: false,
    useUTC: true,
    entities: isCompiled ? [path.join(__dirname, '/database/entities/**/*.js')] : [modelsGlob],
    migrations: isCompiled ? [path.join(__dirname, '/database/migrations/**/*.js')] : [migrationsGlob],
    // entities: [
    //   path.join(
    //     __dirname,
    //     isCompiled ? "/entities/**/*.js" : "/entities/**/*.ts"
    //   ),
    // ],
    // migrations: [
    //   path.join(
    //     __dirname,
    //     isCompiled ? "/migrations/**/*.js" : "/migrations/**/*.ts"
    //   ),
    // ],
    subscribers: [],
    extra: {
        connectionLimit: validatedEnv.DATABASE_CONNECTION_LIMIT,
    },
});

const ensureDatabaseExists = async () => {
    const client = new Client({
        host: validatedEnv.DATABASE_HOST,
        port: validatedEnv.DATABASE_PORT,
        user: validatedEnv.DATABASE_USER,
        password: validatedEnv.DATABASE_PASSWORD,
        database: 'postgres', // Connect to default 'postgres' database
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [validatedEnv.DATABASE_NAME]);

        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${validatedEnv.DATABASE_NAME}"`);
            console.info(`✅ Database ${validatedEnv.DATABASE_NAME} created`);
        } else {
            console.info(`✅ Database ${validatedEnv.DATABASE_NAME} already exists`);
        }
    } catch (error) {
        console.error(`❌ Failed to ensure database exists: ${error as Error}`);
        throw error;
    } finally {
        await client.end();
    }
};

let dataSource: DataSource | undefined;

export const connectDB = async () => {
    if (dataSource?.isInitialized) {
        return dataSource;
    }
    await ensureDatabaseExists();

    try {
        dataSource = await AppDataSource.initialize();
        console.info('✅ Database connection established');

        await dataSource.runMigrations();
        console.info('✅ Migrations executed successfully');

        return dataSource;
    } catch (error) {
        console.error(`❌ Failed to initialize database: ${error as Error}`);
        throw error;
    }
};
