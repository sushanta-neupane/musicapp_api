import { Router } from 'express';
import * as controllers from './users.controllers';
import * as validators from './users.validators';
import { verifyToken } from '../middlewares/verifyToken';
import {
  checkEmailExists,
  checkIsEmailVerified,
  checkDuplicate,
  profileUpload
} from './users.middlewares';
import { uploadImg } from '../middlewares/upload';

const router = Router();

// POST /api/users/signup
router.post('/signup', validators.userSignupValidator, checkDuplicate, controllers.userContSignup);

// POST /api/users/signup
router.post('/login', validators.userLoginValidator, controllers.userContLogin);

// GET /api/users
router.get('/', verifyToken, controllers.userContGetCurrentUser);

// PATCH /api/users
router.patch(
  '/',
  verifyToken,
  validators.userDetailsUpdateValidator,
  uploadImg.single('image'),
  profileUpload,
  controllers.userContUpdateDetails
);

// PATCH /api/users/change-password
router.patch(
  '/change-password',
  verifyToken,
  validators.userPasswordChangeValidator,
  controllers.userContChangePassword
);

// PATCH /api/users/change-username
router.patch(
  '/change-username',
  verifyToken,
  validators.usernameChangeValidator,
  controllers.userContChangeUsername
);

// GET /api/users/username-availability/:username
router.get(
  '/username-availability/:username',
  validators.usernameAvailabilityValidator,
  controllers.userContCheckUsernameAvailability
);

// POST /api/users/verify-email/initiate
router.post(
  '/verify-email/initiate',
  verifyToken,
  checkIsEmailVerified(true),
  controllers.userContSendEmailVerifyLink
);

// PATCH /api/users/verify-email
router.patch(
  '/verify-email',
  validators.verifyEmailValidator,
  verifyToken,
  checkIsEmailVerified(true),
  controllers.userContVerifyEmail
);

// POST /api/users/reset-password/initiate
router.post(
  '/reset-password/initiate',
  validators.resetPasswordInitiateValidator,
  checkEmailExists,
  controllers.userContSendResetPasswordLink
);

// PATCH /api/users/reset-password
router.patch(
  '/reset-password',
  validators.verifyPasswordResetTokenValidator,
  controllers.userContVerifyResetPasswordToken
);

// PATCH /api/users/profile-picture
// router.patch(
//   '/profile-picture',
//   uploadFile('image', false, 2 * 1024),
//   controllers.userContUpdateProfilePicture
// );

export default router;
