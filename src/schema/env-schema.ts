import z from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().int().default(3000),
});
