import { Router } from "express";

import { ApiRoutes } from "@/constants/apiRoutes.constant";
import {
  createUser,
  getAllUsers,
  getUser,
} from "@/controllers/auth.controller";
import { validatePathParam } from "@/middlewares/validatePathParam.middleware";
import { validateReqBody } from "@/middlewares/validateReqBody.middleware";
import { USERID } from "@/schema/pathParam.schema";
import { createUserBodySchema } from "@/schema/reqBody.schema";

export const authRouter = Router();

authRouter.post(
  ApiRoutes.USERS,
  validateReqBody(createUserBodySchema),
  createUser,
);

authRouter.get(ApiRoutes.USERS, getAllUsers);

authRouter.get(
  `${ApiRoutes.USERS}${ApiRoutes.USERID}`,
  validatePathParam(USERID),
  getUser,
);
