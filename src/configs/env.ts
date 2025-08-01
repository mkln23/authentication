import dotenv from "dotenv";

import { envSchema } from "@/schema/env.schema";

dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Environment parse failed");
  process.exit(1);
}

export const validatedEnv = parsedEnv.data;
