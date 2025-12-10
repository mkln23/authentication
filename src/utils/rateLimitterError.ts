import { DEFAULT_RATE_LIMITTER_ERROR_STATUS, RATE_LIMITTER_ERROR } from '@/constants/errors.constant';

export class RateLimitterError extends Error {
    status: number;

    constructor(message: string, status: number = DEFAULT_RATE_LIMITTER_ERROR_STATUS) {
        super(message);
        this.status = status;
        this.name = RATE_LIMITTER_ERROR;
    }
}
