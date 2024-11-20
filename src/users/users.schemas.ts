import Joi from 'joi';

export const SIGNUP_CREDENTIALS_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(256).required(),
  username: Joi.string().alphanum().min(3).max(20).required()
});

export const USER_DETAILS_SCHEMA = Joi.object({
  fullname: Joi.string().min(3).max(32),
  profilePic: Joi.string().optional()
});

export const USER_SIGNUP_SCHEMA = SIGNUP_CREDENTIALS_SCHEMA.concat(USER_DETAILS_SCHEMA);

export const USER_LOGIN_SCHEMA = Joi.object({
  emailOrUsername: Joi.string().required(),
  password: Joi.string().required()
});

export const USER_UPDATE_SCHEMA = USER_DETAILS_SCHEMA;

export const USER_PASSWORD_CHANGE_SCHEMA = Joi.object({
  newPassword: USER_SIGNUP_SCHEMA.extract('password'),
  oldPassword: USER_LOGIN_SCHEMA.extract('password')
});
export const USERNAME_CHANGE_SCHEMA = Joi.object({
  username: USER_SIGNUP_SCHEMA.extract('username')
});

export const VERIFY_EMAIL_SCHEMA = Joi.object({
  token: Joi.string().required().messages({ 'any.required': 'Invalid Link' })
});

export const PASSWORD_RESET_INIT_SCHEMA = Joi.object({
  email: Joi.string().email().required()
});

export const PASSWORD_RESET_TOKEN_VERIFICATION_SCHEMA = Joi.object({
  email: PASSWORD_RESET_INIT_SCHEMA.extract('email'),
  token: Joi.string().required(),
  password: SIGNUP_CREDENTIALS_SCHEMA.extract('password')
});
