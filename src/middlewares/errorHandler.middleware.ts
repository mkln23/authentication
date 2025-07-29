import { isNativeError } from "node:util/types";

import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

import { ApiError } from "@/utils/apiError";
import formatZodError from "@/utils/formatZodError";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  isNativeError(err);

  if (err instanceof ZodError) {
    return res.status(httpStatus.BAD_REQUEST).json(formatZodError(err));
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
}
