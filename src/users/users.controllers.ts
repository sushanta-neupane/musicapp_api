import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendFailureRes, sendSuccessRes } from '../utils/formateResponse';
import { StatusCodes } from 'http-status-codes';
import * as userServices from './users.services';
import { UserLoginCredentials, UserTokenPayload } from '../types/users.types';
import { HttpStatusCode } from 'axios';
import { comparePassword } from '../utils/hashPassword';
import { generateCustomJwt, generateToken } from '../utils/generateToken';
import { User } from '@prisma/client';
import { omit } from 'lodash';
import { deleteImage } from '../config/cloudinary';

export const userContSignup = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const createdUser = await userServices.createNewUser(userData);

  const returningData: Partial<User> = omit(createdUser, 'password');

  const { email, username, fullname, id, isVerified } = createdUser;
  const userPayload: UserTokenPayload = { email, username, fullname, id, isVerified };
  const token = generateToken(res, userPayload);

  return sendSuccessRes(StatusCodes.OK)(res, 'Signup successfull')({ user: returningData, token });
});

export const userContLogin = catchAsync(async (req: Request, res: Response) => {
  const { password } = req.body as UserLoginCredentials;
  const userInDb = req.undecoded;

  if (!userInDb) {
    return sendFailureRes(HttpStatusCode.Unauthorized)(res, `Invalid credentials`)({});
  }

  const isPasswordCorrect = await comparePassword(password, userInDb.password);

  if (!isPasswordCorrect) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, `Invalid credentials`)({});
  }

  const { email, username, fullname, id, isVerified } = userInDb;
  const userPayload: UserTokenPayload = { email, username, fullname, id, isVerified };
  const token = generateToken(res, userPayload);

  const returningData: Partial<User> = omit(userInDb, 'password');

  return sendSuccessRes(StatusCodes.OK)(res, 'Login successfull')({ user: returningData, token });
});

export const userContGetCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.decoded!;
  const user = await userServices.getUserById(id);
  const returningData = omit(user, 'password');

  return sendSuccessRes(StatusCodes.OK)(res, 'User data Fetched')({ user: returningData });
});

export const userContUpdateDetails = catchAsync(async (req: Request, res: Response) => {
  const { profilePic, publicId, ...otherDetails } = req.body; // Extract profilePic and publicId
  const { id } = req.decoded!; // Get user ID from the decoded token

  // Construct the update object
  const updatingUserDetails: Record<string, any> = { ...otherDetails };
  if (profilePic) {
    updatingUserDetails.profilePic = profilePic;
  }

  try {
    // Update user details in the database
    const newData = await userServices.updateUserDetails(id, updatingUserDetails);

    // Send success response
    return sendSuccessRes(StatusCodes.OK)(res, 'User details updated')(newData);
  } catch (error) {
    console.error('Error updating user details:', error);

    // Cleanup uploaded image if DB operation fails
    if (publicId) {
      try {
        await deleteImage(publicId);
        console.log(`Cleaned up image with publicId: ${publicId}`);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded image:', cleanupError);
      }
    }

    // Propagate the error to the global error handler
    throw error;
  }
});

export const userContChangePassword = catchAsync(async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const { id } = req.decoded!;

  const newData = await userServices.changePassword(id, newPassword);

  const returningData = omit(newData, 'password');

  return sendSuccessRes(StatusCodes.OK)(res, 'Password changed Successfully')(returningData);
});

export const userContChangeUsername = catchAsync(async (req: Request, res: Response) => {
  const { username } = req.body;
  const { id } = req.decoded!;

  const newData = await userServices.changeUsername(id, username);

  const returningData = omit(newData, 'password');

  return sendSuccessRes(StatusCodes.OK)(res, 'Username changed Successfully')(returningData);
});

export const userContCheckUsernameAvailability = catchAsync(async (req: Request, res: Response) => {
  const { username } = req.params;

  const isUsernameTaken = await userServices.doesUserExist(username);

  if (isUsernameTaken) {
    return sendFailureRes(StatusCodes.CONFLICT)(res, 'Username is not available')({ username });
  }

  return sendSuccessRes(StatusCodes.OK)(res, 'Username is available')({ username });
});

export const userContVerifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.decoded!;
  const { token } = req.body;

  try {
    userServices.verifyEmailToken(id, token);
    await userServices.updateUserDetails(id, { isVerified: true });
  } catch (error) {
    return sendFailureRes(StatusCodes.UNAUTHORIZED)(res, 'Invalid or Expired link')({});
  }

  return sendSuccessRes(StatusCodes.OK)(res, 'Email verified successfully')({});
});

export const userContSendEmailVerifyLink = catchAsync(async (req: Request, res: Response) => {
  const { id, email } = req.decoded!;

  const token = generateCustomJwt({ id }, { expiresIn: '1h' });
  await userServices.sendVerificationEmail(email, token);

  return sendSuccessRes(StatusCodes.OK)(res, 'verification email sent')({ email });
});

export const userContSendResetPasswordLink = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const { token } = await userServices.generatePasswordResetToken(req.undecoded!);

  await userServices.sendPasswordResetEmail(email, token);

  return sendSuccessRes(StatusCodes.OK)(res, 'Password reset email sent')({ email });
});

export const userContVerifyResetPasswordToken = catchAsync(async (req: Request, res: Response) => {
  const { email, token, password } = req.body;

  const tokenData = await userServices.getTokenByEmailAndToken(email, token);
  const payload = userServices.checkPasswordResetTokenValidity(tokenData?.token);

  await userServices.changePassword(payload.id, password);
  await userServices.deleteTokenById(tokenData!.id);

  return sendSuccessRes(StatusCodes.OK)(res, 'Password changed successfully')({ email });
});

// export const userContUpdateProfilePicture = catchAsync(async (req: Request, res: Response) => {
//   console.log(req.uploadDir);

//   // await rm(req.uploadDir!, { recursive: true });

//   return sendSuccessRes(StatusCodes.OK)(res, 'Profile picture updated')({});
// });

/**
 * TODO:
 * 1. user profile pic update route
 * 1. Add proper email template for password reset and email verify
 * 1. Rate limit for email verification and password reset
 */
