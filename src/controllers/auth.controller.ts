import type { RequestHandler, Response } from "express";
import httpStatus from "http-status";

import {
  NO_USER_EXIST,
  USER_DOES_NOT_EXIST,
} from "@/constants/errors.constant";
import type { UserIdType } from "@/schema/pathParam.schema";
import type { CreateUserBodyType } from "@/schema/reqBody.schema";
import { AuthService } from "@/services/auth.service";
import { ApiError } from "@/utils/apiError";
import type { CustomRequest } from "@/utils/customRequest";

export const createUser = async (
  req: CustomRequest<{}, {}, CreateUserBodyType>,
  res: Response,
) => {
  const user = await AuthService.createNewUser(req.body);
  res.status(httpStatus.CREATED).json({
    user,
  });
};

export const getUser = async (
  req: CustomRequest<{}, UserIdType>,
  res: Response,
) => {
  const user = await AuthService.getUserById(+req.params.userId);
  if (!user) {
    throw new ApiError(USER_DOES_NOT_EXIST, httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.FOUND).json({
    user,
  });
};

export const getAllUsers: RequestHandler = async (_, res) => {
  const users = await AuthService.getAllActiveUsers();
  if (!users.length) {
    throw new ApiError(NO_USER_EXIST, httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.FOUND).json({
    users,
  });
};
