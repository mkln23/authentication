import httpStatus from 'http-status';

export const VALIDATION_ERROR = 'Validation error';

export const validationError = {
    valueNotFound: (key: string) => `Value for '${key.toLowerCase()}' cannot be empty`,
    keyNotFound: (key: string) => `Key '${key.toLowerCase()}' not found in the request body`,
    invalidValue: (key: string) => `Invalid value for '${key.toLowerCase()}'`,
    keyMustBeValidNumber: (key: string) => `Key '${key.toLowerCase()}' must be a valid number`,
};

export const EMAIL_ERROR = 'Error while sending email';
export const WRONG_OTP = 'Enter a valid OTP';

export const DEFAULT_ERROR_NAME = 'ApiError';
export const DATABASE_ERROR = 'DatabaseQueryError';
export const DEFAULT_ERROR_STATUS = httpStatus.INTERNAL_SERVER_ERROR;
export const UPDATE_FAILED = 'Update failed: record not found after update';
export const UPSERT_FAILED = 'Upsert failed: record not found after upsert';
export const DEFAULT_RATE_LIMITTER_ERROR_STATUS = httpStatus.TOO_MANY_REQUESTS;
export const RATE_LIMITTER_ERROR = 'RateLimittingError';
export const TOO_MANY_REQUESTS = 'Too many requests';
export const IP_NOT_FOUND_ERROR = 'IP address not found';
export const REDIS_ERROR = 'Redis Connection error';
export const INTERNAL_SERVER_ERROR = 'Internal Server Error';

export const userAlreadyExist = (email: string) => `User with email ${email} already exists`;
export const userDoesNotExistWithGivenKey = (key: string) => `No active user exists with the given ${key}`;
export const NO_USER_EXIST = 'No active user exists';
export const USER_ALREADY_ACTIVE = 'User is already active';
export const USER_DELETED = 'User Profile is deleted';
export const USER_ALREADY_DISABLED = 'User Profile is already disabled';
export const PROFILE_SHOULD_BE_ACTIVE = 'Profile should be activated to perform this action';

export const INVALID_DB_ENTRY = 'Invalid data in database';
export const INVALID_TOKEN = 'Invalid token';
export const WRONG_PASSWORD = 'Wrong Password';
export const USER_UNAUTHORISED = 'User is unauthorised';
export const TOKEN_MISSING = 'Authorization header missing or invalid';
