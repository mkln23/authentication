import { Router } from "express";

import { ApiRoutes } from "@/constants/apiRoutes";

export const authRouter = Router();

authRouter.get(ApiRoutes.HELLO, (_, res) => {
  res.json({
    message: "hi",
  });
});
