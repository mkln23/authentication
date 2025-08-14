// redisClient.ts
import { Redis } from "@upstash/redis";

import { REDIS_ERROR } from "@/constants/errors.constant";
import { ApiError } from "@/utils/apiError";

import { validatedEnv } from "./env";

let client: Redis | null = null;

export function getRedisClient(): Redis {
  if (!client) {
    try {
      client = new Redis({
        url: validatedEnv.UPSTASH_REDIS_REST_URL,
        token: validatedEnv.UPSTASH_REDIS_REST_TOKEN,
      });
    } catch {
      throw new ApiError(REDIS_ERROR);
    }
  }

  return client;
}
