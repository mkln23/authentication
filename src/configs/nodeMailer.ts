import nodemailer from 'nodemailer';

import { validatedEnv } from './env';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: validatedEnv.MAIL_USERNAME,
        pass: validatedEnv.PASS_KEY,
    },
});

export default transporter;
