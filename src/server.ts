import 'express-async-errors';

import express from 'express';

import { ApiRoutes } from './constants/apiRoutes.constant';
import errorHandler from './middlewares/errorHandler.middleware';
import { apiRouter } from './routes';
// import rateLimiter from "./utils/rateLimitter";

const app = express();
app.use(express.json());
// app.use(rateLimiter);
app.use(ApiRoutes.API_BASE, apiRouter);
app.use(errorHandler);

export default app;
