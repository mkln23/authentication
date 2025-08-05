import z from "zod";

import { validationError } from "@/constants/errors.constant";
import { RegEx } from "@/constants/regEx.constant";

export const EMAIL = "email";

export const createUserBodySchema = z.object({
  name: z.string().nonempty(validationError.valueNotFound("name")),
  email: z.email().nonempty(validationError.valueNotFound("email")),
  mobile: z
    .string()
    .regex(RegEx.MOBILE_NUMBER, "Mobile number must contain only digits")
    .optional(),
  password: z.string().nonempty(validationError.valueNotFound("password")),
});

export const otpBodySchema = z.object({
  otp: z.string(),
});

export const loginBodySchema = z.object({
  email: z.email(),
  password: z.string().default(""),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
});

export type CreateUserBodyType = z.infer<typeof createUserBodySchema>;
export type OTPBodyType = z.infer<typeof otpBodySchema>;
export type LoginBodyType = z.infer<typeof loginBodySchema>;
export type RefreshTokenBodyType = z.infer<typeof refreshTokenBodySchema>;
