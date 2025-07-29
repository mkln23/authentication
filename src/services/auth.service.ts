import httpStatus from "http-status";

import { userAlreadyExist } from "@/constants/errors.constant";
import { Users } from "@/database/entities/User.entity";
import type { CreateUserBodyType } from "@/schema/reqBody.schema";
import { ApiError } from "@/utils/apiError";

import { find, findOne, insertOne } from "./database.service";

export class AuthService {
  static async createNewUser(userBody: CreateUserBodyType) {
    const existingUser = await findOne(Users, {
      where: { email: userBody.email },
    });
    if (existingUser) {
      throw new ApiError(userAlreadyExist(userBody.email), httpStatus.CONFLICT);
    }
    const result = await insertOne(Users, userBody);
    return result;
  }

  static async getUserById(userId: number) {
    const result = await findOne(Users, {
      where: { id: userId, deletedAt: undefined },
    });
    return result;
  }

  static async getAllActiveUsers() {
    const result = await find(Users, { where: { deletedAt: undefined } });
    return result;
  }
}
