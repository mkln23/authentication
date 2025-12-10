import type { RequestHandler, Response } from 'express';
import httpStatus from 'http-status';

import { NO_USER_EXIST, userDoesNotExistWithGivenKey } from '@/constants/errors.constant';
import { ProfileAction } from '@/enums/profileAction.enum';
import { USERID, type UserIdType } from '@/schema/pathParam.schema';
import type { ActionQueryType } from '@/schema/queryParam.schema';
import type { CreateUserBodyType, LoginBodyType, OTPBodyType, RefreshTokenBodyType } from '@/schema/reqBody.schema';
import { AuthService } from '@/services/auth.service';
import { MailService } from '@/services/mail.service';
import { ApiError } from '@/utils/apiError';
import type { CustomRequest } from '@/utils/customRequest';
import { getAccessToken } from '@/utils/token';

export const createUser = async (req: CustomRequest<{}, {}, CreateUserBodyType>, res: Response) => {
    const user = await AuthService.createNewUser(req.body);
    res.status(httpStatus.CREATED).json({
        user,
    });
};

export const getUser = async (req: CustomRequest<{}, UserIdType>, res: Response) => {
    const user = await AuthService.getUserById(+req.params.userId);
    if (!user) {
        throw new ApiError(userDoesNotExistWithGivenKey(USERID), httpStatus.NOT_FOUND);
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

export const sendMail: RequestHandler = async (_, res) => {
    await MailService.sendMail(ProfileAction.ACTIVATE, 'mukilan.seetharaman@rootquotient.com', 'otp');
    return res.status(httpStatus.OK).json({
        message: 'Email sent successfully',
    });
};

export const sendOTP = async (req: CustomRequest<ActionQueryType, UserIdType>, res: Response) => {
    const result = await AuthService.sendOTPByUserId(+req.params.userId, req.query.action);
    return res.status(httpStatus.OK).json(result);
};

export const verifyOTP = async (req: CustomRequest<ActionQueryType, UserIdType, OTPBodyType>, res: Response) => {
    const result = await AuthService.verifyOTPByUserId(+req.params.userId, req.query.action, req.body.otp);
    return res.status(httpStatus.OK).json(result);
};

export const login = async (req: CustomRequest<{}, {}, LoginBodyType>, res: Response) => {
    const tokens = await AuthService.loginCustomer(req.body);
    res.status(httpStatus.OK).json(tokens);
};

export const refreshToken = (req: CustomRequest<{}, {}, RefreshTokenBodyType>, res: Response) => {
    const result = getAccessToken(req.body.refreshToken);
    res.status(httpStatus.OK).json(result);
};
