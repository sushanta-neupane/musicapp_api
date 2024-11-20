import { User } from '@prisma/client';
import db from '../db';
import { hashPassword } from '../utils/hashPassword';
import { UpdateUser } from '../types/users.types';
import { omit } from 'lodash';
import { badRequest, conflict } from '@hapi/boom';
import { mailTransporter } from '../utils/sendMail';
import {
  generateEmailBodyForPasswordReset,
  generateEmailBodyForVerificationLinkEmail
} from './users.utils';
import { EMAIL_VERIFICATION_MAIL_SUBJECT } from './users.configs';
import { verifyCustomJwt } from '../middlewares/verifyToken';
import { JwtPayload } from 'jsonwebtoken';
import { generateCustomJwt } from '../utils/generateToken';

export const createNewUser = async (userCreateData: User) => {
  const hashed = await hashPassword(userCreateData.password);

  return db.user.create({
    data: { ...userCreateData, password: hashed }
  });
};

export const getUserByUsername = (username: string) => {
  return db.user.findFirst({ where: { username } });
};

export const getUserById = (id: string) => {
  return db.user.findFirst({ where: { id } });
};

export const getUserByEmail = (email: string) => {
  return db.user.findFirst({ where: { email } });
};

export const doesUserExist = (emailOrUsername: string) => {
  if (emailOrUsername.includes('@')) {
    return getUserByEmail(emailOrUsername);
  }

  return getUserByUsername(emailOrUsername);
};

export const updateUserDetails = async (id: string, updatingData: UpdateUser) => {
  const user = await db.user.update({ data: updatingData, where: { id } });

  return omit(user, 'password') as Omit<User, 'password'>;
};

export const changePassword = async (id: string, newPassword: string) => {
  const hashed = await hashPassword(newPassword);

  return db.user.update({ where: { id }, data: { password: hashed } });
};

export const changeUsername = async (id: string, username: string) => {
  const isUsernameTaken = await doesUsernameExist(username);
  if (isUsernameTaken) {
    throw conflict('Username is not available');
  }

  return db.user.update({ where: { id }, data: { username } });
};

export const doesUsernameExist = async (username: string) => {
  const count = await db.user.count({ where: { username } });
  if (count > 0) {
    return false;
  }

  return true;
};

export const sendVerificationEmail = (email: string, token: string) => {
  const { text } = generateEmailBodyForVerificationLinkEmail(token);

  return mailTransporter.sendMail({
    to: email,
    text,
    subject: EMAIL_VERIFICATION_MAIL_SUBJECT,
    from: process.env.SMTP_FROM
  });
};

export const verifyEmailToken = (id: string, token: string) => {
  const { id: payloadId } = verifyCustomJwt(token) as JwtPayload;

  if (id !== payloadId) {
    throw 'Invalid Token';
  }
};

export const sendPasswordResetEmail = (email: string, token: string) => {
  const { text } = generateEmailBodyForPasswordReset(email, token);

  return mailTransporter.sendMail({
    to: email,
    text,
    subject: EMAIL_VERIFICATION_MAIL_SUBJECT,
    from: process.env.SMTP_FROM
  });
};

export const generatePasswordResetToken = (user: User) => {
  const token = generateCustomJwt({ email: user.email, id: user.id }, { expiresIn: '1d' });

  return db.token.create({ data: { token, email: user.email } });
};

export const getTokenByEmailAndToken = (email: string, token: string) => {
  return db.token.findFirst({ where: { token, email } });
};

export const checkPasswordResetTokenValidity = (token: string | undefined) => {
  if (!token) {
    throw badRequest('Invalid or Expired Link');
  }
  const payload = verifyCustomJwt(token) as JwtPayload;

  if (!payload.email || !payload.id) {
    throw badRequest('Invalid or Expired Link');
  }

  return payload as { email: string; id: string } & JwtPayload;
};

export const deleteTokenById = (id: string) => {
  return db.token.delete({ where: { id } });
};
