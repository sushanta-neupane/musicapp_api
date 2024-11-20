import { NextFunction, Response, Request } from 'express';
import { validate } from '../utils/validate';
import { User } from '@prisma/client';
import {
  PASSWORD_RESET_INIT_SCHEMA,
  PASSWORD_RESET_TOKEN_VERIFICATION_SCHEMA,
  USER_LOGIN_SCHEMA,
  USER_PASSWORD_CHANGE_SCHEMA,
  USER_SIGNUP_SCHEMA,
  USER_UPDATE_SCHEMA,
  USERNAME_CHANGE_SCHEMA,
  VERIFY_EMAIL_SCHEMA
} from './users.schemas';
import { catchAsync } from '../utils/catchAsync';
import { doesUserExist } from './users.services';
import { sendFailureRes } from '../utils/formateResponse';
import { StatusCodes } from 'http-status-codes';
import { comparePassword } from '../utils/hashPassword';

export const userSignupValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate<User>(req.body, USER_SIGNUP_SCHEMA);

    return next();
  }
);

export const userLoginValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate<User>(req.body, USER_LOGIN_SCHEMA);

    const user = await doesUserExist(req.body.emailOrUsername);

    if (!user) {
      return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'One or more credential/s is invalid')(
        {}
      );
    }
    req.undecoded = user;

    return next();
  }
);

export const userDetailsUpdateValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, USER_UPDATE_SCHEMA);

    return next();
  }
);

export const userPasswordChangeValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, USER_PASSWORD_CHANGE_SCHEMA);

    const { oldPassword, newPassword } = req.body;

    const user = req.decoded!;

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'incorrect current password')({});
    }

    if (oldPassword === newPassword) {
      return sendFailureRes(StatusCodes.BAD_REQUEST)(
        res,
        `New password can't be same as old password`
      )({});
    }

    return next();
  }
);

export const usernameChangeValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, USERNAME_CHANGE_SCHEMA);

    return next();
  }
);
export const usernameAvailabilityValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.params, USERNAME_CHANGE_SCHEMA);

    return next();
  }
);

export const verifyEmailValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, VERIFY_EMAIL_SCHEMA);

    return next();
  }
);

export const resetPasswordInitiateValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, PASSWORD_RESET_INIT_SCHEMA);

    return next();
  }
);

export const verifyPasswordResetTokenValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, PASSWORD_RESET_TOKEN_VERIFICATION_SCHEMA);

    return next();
  }
);
