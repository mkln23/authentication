import express from "express";
import { createServer } from "http";

import { validatedEnv } from "./configs/env";
import { ApiRoutes } from "./constants/apiRoutes";
import { apiRouter } from "./routes";

export const app = express();
app.use(express.json());
app.use(ApiRoutes.API_BASE, apiRouter);

const server = createServer(app);
const port = validatedEnv.PORT;

try {
  server.listen(port, () => {
    console.info(`Server started at port ${port}`);
  });
} catch (error) {
  console.error(error);
}
