import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes } from '../utils/formateResponse';
import { StatusCodes } from 'http-status-codes';
import db from '../db';
import { imageUploader } from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

export const checkIsEmailVerified = (throwErrorIfVerified: boolean = false) =>
  catchAsync((req: Request, res: Response, next: NextFunction) => {
    const user = req.decoded!;

    // useful for email verify request
    if (throwErrorIfVerified) {
      if (user.isVerified) {
        return sendFailureRes(StatusCodes.OK)(res, 'Email is already verified')({});
      }

      return next();
    }

    // useful for other requests
    if (!user.isVerified) {
      return sendFailureRes(StatusCodes.OK)(res, 'You must verify your Email')({});
    }

    return next();
  });

export const checkEmailExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    const user = await db.user.findFirst({ where: { email } });

    if (!user) {
      return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'User does not exist')({});
    }
    req.undecoded = user;

    return next();
  }
);

export const checkDuplicate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const username = req.body.username;

    // Check for existing email
    const emailUser = await db.user.findFirst({ where: { email } });
    if (emailUser) {
      req.undecoded = emailUser;

      return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Email already in use')({});
    }

    // Check for existing username
    const usernameUser = await db.user.findFirst({ where: { username } });
    if (usernameUser) {
      req.undecoded = usernameUser;
      return sendFailureRes(StatusCodes.BAD_REQUEST)(res, 'Username already in use')({});
    }

    return next();
  }
);

export const profileUpload = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check if a file exists in the request (optional image update)
  if (!req.file) {
    delete req.body.profilePic;
    return next();
  }

  try {
    // Extract file buffer and upload to Cloudinary
    const result = await imageUploader(req.file.buffer, 'user_profiles');
    if (!result) {
      throw Error('Upload failed');
    }
    const { secure_url, public_id } = result as UploadApiResponse;
    req.body.profilePic = secure_url;
    req.body.publicId = public_id;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return next(error);
  }

  next();
});
