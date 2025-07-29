import type { RequestHandler } from "express";
import httpStatus from "http-status";

import { validationError } from "@/constants/errors.constant";
import { RegEx } from "@/constants/regEx.constant";
import { ApiError } from "@/utils/apiError";

export const validatePathParam = (key: string): RequestHandler => {
  return (req, _, next) => {
    const param = req.params[key];
    const rgxp = new RegExp(RegEx.INT, "img");
    if (!param || !rgxp.test(param) || !Number.parseInt(param)) {
      throw new ApiError(
        validationError.keyMustBeValidNumber(key),
        httpStatus.BAD_REQUEST,
      );
    }
    next();
  };
};
