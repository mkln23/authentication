import { Router } from "express";

import { ApiRoutes } from "@/constants/apiRoutes";
import { healthCheck } from "@/controllers/health.controller";

import { authRouter } from "./auth";

export const apiRouter = Router();

apiRouter.use(ApiRoutes.AUTH, authRouter);

apiRouter.get(ApiRoutes.HEALTH, healthCheck);
