// import { DEFAULT_ERROR_NAME, DEFAULT_ERROR_STATUS } from '../constants/error';
import httpStatus from 'http-status';

import { DEFAULT_ERROR_NAME, DEFAULT_ERROR_STATUS } from '@/constants/errors.constant';

class ApiError extends Error {
    status: number;

    constructor(message: string, status: number = DEFAULT_ERROR_STATUS) {
        super(message);
        this.status = status;
        this.name = DEFAULT_ERROR_NAME;
    }
}

class EmailError extends ApiError {
    constructor(message: string) {
        super(message, httpStatus.BAD_REQUEST); // 403
    }
}

export { ApiError, EmailError };
