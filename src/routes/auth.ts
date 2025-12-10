import { Router } from 'express';

import { ApiRoutes } from '@/constants/apiRoutes.constant';
import {
    createUser,
    getAllUsers,
    getUser,
    login,
    refreshToken,
    sendMail,
    sendOTP,
    verifyOTP,
} from '@/controllers/auth.controller';
import { validatePathParam } from '@/middlewares/validatePathParam.middleware';
import { validateQueryParams } from '@/middlewares/validateQueryParams.middleware';
import { validateReqBody } from '@/middlewares/validateReqBody.middleware';
import { validateToken } from '@/middlewares/validateToken.middleware';
import { USERID } from '@/schema/pathParam.schema';
import { actionSchema } from '@/schema/queryParam.schema';
import { createUserBodySchema, loginBodySchema, otpBodySchema, refreshTokenBodySchema } from '@/schema/reqBody.schema';

export const authRouter = Router();

authRouter.post(ApiRoutes.USERS, validateReqBody(createUserBodySchema), createUser);

authRouter.get(ApiRoutes.USERS, validateToken, getAllUsers);

authRouter.get(`${ApiRoutes.USERS}${ApiRoutes.USERID}`, validatePathParam(USERID), getUser);

authRouter.post(ApiRoutes.SEND_MAIL, sendMail);

authRouter.get(
    `${ApiRoutes.USERS}${ApiRoutes.USERID}${ApiRoutes.SEND_OTP}`,
    [validatePathParam(USERID), validateQueryParams(actionSchema)],
    sendOTP,
);

authRouter.post(
    `${ApiRoutes.USERS}${ApiRoutes.USERID}${ApiRoutes.VERIFY_OTP}`,
    [validatePathParam(USERID), validateQueryParams(actionSchema), validateReqBody(otpBodySchema)],
    verifyOTP,
);

authRouter.post(ApiRoutes.LOGIN, validateReqBody(loginBodySchema), login);

authRouter.post(ApiRoutes.REFRESH_TOKEN, validateReqBody(refreshTokenBodySchema), refreshToken);
