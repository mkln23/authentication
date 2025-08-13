import z from "zod";

import { NodeEnv } from "@/enums/nodeEnv.enum";

export const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NodeEnv) as [NodeEnv, ...NodeEnv[]]),
  PORT: z.coerce.number().default(3000),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_CONNECTION_LIMIT: z.coerce.number().default(10),
  SALT_ROUNDS: z.coerce.number().default(10),
  MAIL_USERNAME: z.email(),
  PASS_KEY: z.string(),
  TOTP_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});
