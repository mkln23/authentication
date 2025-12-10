import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const validateReqBody = <T extends object>(schema: ZodType<T>): RequestHandler => {
    return async (req, _, next) => {
        const result = await schema.parseAsync(req.body);
        req.body = result;
        next();
    };
};
