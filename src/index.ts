import 'reflect-metadata';
import 'express-async-errors';

import { connectDB } from './configs/database';
import { validatedEnv } from './configs/env';
import app from './server';

const port = validatedEnv.PORT;
const startServer = async () => {
    await connectDB();
    const server = app.listen(port, () => {
        console.info(`✅ Server started at port ${port}`);
    });
    return server;
};

startServer().catch(error => {
    console.error(`❌ Error starting server: ${error}`);
});
