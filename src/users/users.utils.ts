import dotenv from 'dotenv';
import { EMAIL_VERIFY_FRONTEND_LINK, PASSWORD_RESET_FRONTEND_LINK } from './users.configs';
dotenv.config();

export const generateEmailBodyForVerificationLinkEmail = (token: string) => {
  const text = `
  Let's verify your email
  Click on the following link
  ${EMAIL_VERIFY_FRONTEND_LINK}?token=${token}
  `;

  const html = undefined;

  return { text, html };
};

export const generateEmailBodyForPasswordReset = (email: string, token: string) => {
  const text = `
  Hey, You requested for password reset
  Click on the following link
  ${PASSWORD_RESET_FRONTEND_LINK}?token=${token}&email=${email}
  `;

  const html = undefined;

  return { text, html };
};
