import { validatedEnv } from '@/configs/env';
import transporter from '@/configs/nodeMailer';
import { ProfileAction } from '@/enums/profileAction.enum';
import { EmailError } from '@/utils/apiError';

export class MailService {
    static async sendMail(action: ProfileAction, to: string, otp: string) {
        const mailOptions = this.createMailOptions(action, to, otp);
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            throw new EmailError(error as string);
        }
    }

    private static createMailOptions(action: ProfileAction, to: string, otp: string) {
        return {
            from: validatedEnv.MAIL_USERNAME,
            to,
            subject:
                action === ProfileAction.ACTIVATE
                    ? 'Welcome to My App'
                    : action === ProfileAction.LOGIN
                      ? 'Login OTP'
                      : action === ProfileAction.DISABLE
                        ? 'Disable your profile?'
                        : 'My App was happy to have you',
            text: `To ${action as string} your account, enter the OTP: ${otp}`,
        };
    }
}
