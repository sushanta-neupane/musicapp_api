import dotenv from 'dotenv';
dotenv.config();

export const EMAIL_VERIFICATION_MAIL_SUBJECT = 'Verify your Email';
export const EMAIL_VERIFY_FRONTEND_LINK = `${process.env.FRONTEND_BASE_URL}/verify-email`;
export const PASSWORD_RESET_FRONTEND_LINK = `${process.env.FRONTEND_BASE_URL}/reset-password`;
