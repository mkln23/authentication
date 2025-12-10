import type { ZodError } from 'zod';

import { VALIDATION_ERROR, validationError } from '@/constants/errors.constant';

export default function formatZodError(err: ZodError) {
    return {
        message: VALIDATION_ERROR,
        errors: err.issues.map(issue => {
            if (issue.code === 'invalid_type') {
                return validationError.keyNotFound(issue.path[0].toString());
            }
            return issue.message;
        }),
    };
}
