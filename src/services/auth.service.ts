import httpStatus from "http-status";

// import { totp } from "otplib";
import { validatedEnv } from "@/configs/env";
import totp from "@/configs/totp";
import {
  PROFILE_SHOULD_BE_ACTIVE,
  USER_ALREADY_ACTIVE,
  USER_ALREADY_DISABLED,
  USER_DELETED,
  USER_DOES_NOT_EXIST,
  userAlreadyExist,
  WRONG_OTP,
} from "@/constants/errors.constant";
import { Users } from "@/database/entities/User.entity";
import { ProfileAction } from "@/enums/profileAction.enum";
import { UserStatus } from "@/enums/userStatus.enums";
import type { CreateUserBodyType } from "@/schema/reqBody.schema";
import { ApiError } from "@/utils/apiError";

import { find, findOne, insertOne, updateOne } from "./database.service";
import { MailService } from "./mail.service";

export class AuthService {
  static async createNewUser(userBody: CreateUserBodyType) {
    const existingUser = await findOne(Users, {
      where: { email: userBody.email },
    });
    if (existingUser) {
      throw new ApiError(userAlreadyExist(userBody.email), httpStatus.CONFLICT);
    }
    const mfaSecret = totp.generate(
      validatedEnv.TOTP_SECRET + ":" + ProfileAction.ACTIVATE,
    );
    const userPayload = { ...userBody, mfaSecret };
    const result = await insertOne(Users, userPayload);
    await MailService.sendMail(
      ProfileAction.ACTIVATE,
      userPayload.email,
      mfaSecret,
    );
    return result;
  }

  static async getUserById(userId: number) {
    const result = await findOne(Users, {
      where: { id: userId, status: UserStatus.ACTIVE },
    });
    return result;
  }

  static async getAllActiveUsers() {
    const result = await find(Users, { where: { status: UserStatus.ACTIVE } });
    return result;
  }

  static async sendOTPByUserId(userId: number, action: ProfileAction) {
    const user = await findOne(Users, {
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(USER_DOES_NOT_EXIST, httpStatus.NOT_FOUND);
    }

    const mfaSecret = totp.generate(validatedEnv.TOTP_SECRET + ":" + action);

    this.throwErrorIfActionNotAllowed(user, action);

    await updateOne(Users, { id: userId }, { mfaSecret });

    await MailService.sendMail(action, user.email, mfaSecret);

    return {
      mfaSecret,
    };
  }

  static async verifyOTPByUserId(
    userId: number,
    action: ProfileAction,
    otp: string,
  ) {
    const user = await findOne(Users, {
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(USER_DOES_NOT_EXIST, httpStatus.NOT_FOUND);
    }

    this.throwErrorIfActionNotAllowed(user, action);

    const isValid = totp.check(otp, validatedEnv.TOTP_SECRET + ":" + action);
    if (!isValid) {
      throw new ApiError(WRONG_OTP);
    }

    let status!: UserStatus;

    switch (action) {
      case ProfileAction.ACTIVATE: {
        status = UserStatus.ACTIVE;
        break;
      }

      case ProfileAction.DISABLE: {
        status = UserStatus.DISABLED;
        break;
      }

      case ProfileAction.DELETE: {
        status = UserStatus.DELETED;
        break;
      }

      case ProfileAction.LOGIN: {
        status = user.status;
        break;
      }
    }

    const result = await updateOne(Users, { id: userId }, { status });

    return {
      message: "OTP verified",
      status: result.status,
    };
  }

  private static throwErrorIfActionNotAllowed(
    user: Users,
    action: ProfileAction,
  ) {
    switch (action) {
      case ProfileAction.ACTIVATE: {
        if (user.status === UserStatus.ACTIVE) {
          throw new ApiError(USER_ALREADY_ACTIVE, httpStatus.BAD_REQUEST);
        }
        if (user.status === UserStatus.DELETED) {
          throw new ApiError(USER_DELETED, httpStatus.BAD_REQUEST);
        }

        break;
      }

      case ProfileAction.DISABLE: {
        if (user.status === UserStatus.CREATED) {
          throw new ApiError(PROFILE_SHOULD_BE_ACTIVE, httpStatus.BAD_REQUEST);
        }
        if (user.status === UserStatus.DISABLED) {
          throw new ApiError(USER_ALREADY_DISABLED, httpStatus.BAD_REQUEST);
        }
        if (user.status === UserStatus.DELETED) {
          throw new ApiError(USER_DELETED, httpStatus.BAD_REQUEST);
        }
        break;
      }

      case ProfileAction.DELETE: {
        if (user.status === UserStatus.CREATED) {
          throw new ApiError(PROFILE_SHOULD_BE_ACTIVE, httpStatus.BAD_REQUEST);
        }
        if (user.status === UserStatus.DELETED) {
          throw new ApiError(USER_DELETED, httpStatus.BAD_REQUEST);
        }
        break;
      }

      case ProfileAction.LOGIN: {
        if (user.status === UserStatus.CREATED) {
          throw new ApiError(PROFILE_SHOULD_BE_ACTIVE, httpStatus.BAD_REQUEST);
        }
        if (user.status === UserStatus.DELETED) {
          throw new ApiError(USER_DELETED, httpStatus.BAD_REQUEST);
        }
        break;
      }
    }
  }
}
