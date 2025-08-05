import type { RequestHandler } from "express";
import type { ParsedQs } from "qs";
import type { ZodType } from "zod";

export const validateQueryParams = <T extends object>(
  schema: ZodType<T>,
): RequestHandler => {
  return async (req, _, next) => {
    const query = await schema.parseAsync(req.query);
    req.query = query as ParsedQs;
    next();
  };
};
