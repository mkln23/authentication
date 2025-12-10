import { totp } from 'otplib';

totp.options = {
    step: 120,
    window: 0,
};

export default totp;
