import z from "zod";

import { validationError } from "@/constants/errors.constant";
import { RegEx } from "@/constants/regEx.constant";

export const USERID = "userId";

export const userIdSchema = z.object({
  userId: z.string().regex(RegEx.INT, validationError.invalidValue(USERID)),
});

export type UserIdType = z.infer<typeof userIdSchema>;
