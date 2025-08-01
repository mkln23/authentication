import "express-async-errors";

import express from "express";

import { ApiRoutes } from "./constants/apiRoutes.constant";
import errorHandler from "./middlewares/errorHandler.middleware";
import { apiRouter } from "./routes";

const app = express();
app.use(express.json());
app.use(ApiRoutes.API_BASE, apiRouter);
app.use(errorHandler);

export default app;
