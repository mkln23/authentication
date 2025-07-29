import httpStatus from "http-status";

export const VALIDATION_ERROR = "Validation error";

export const validationError = {
  valueNotFound: (key: string) =>
    `Value for '${key.toLowerCase()}' cannot be empty`,
  keyNotFound: (key: string) =>
    `Key '${key.toLowerCase()}' not found in the request body`,
  invalidValue: (key: string) => `Invalid value for '${key.toLowerCase()}'`,
  keyMustBeValidNumber: (key: string) =>
    `Key '${key.toLowerCase()}' must be a valid number`,
};

export const DEFAULT_ERROR_NAME = "ApiError";
export const DEFAULT_ERROR_STATUS = httpStatus.INTERNAL_SERVER_ERROR;

export const userAlreadyExist = (email: string) =>
  `User with email ${email} already exists`;
export const USER_DOES_NOT_EXIST = "No active user exists with the given ID";
export const NO_USER_EXIST = "No active user exists";
