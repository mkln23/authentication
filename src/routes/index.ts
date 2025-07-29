import { Router } from "express";

import { ApiRoutes } from "@/constants/apiRoutes";

import { authRouter } from "./auth";

export const apiRouter = Router();

apiRouter.use(ApiRoutes.AUTH, authRouter);
