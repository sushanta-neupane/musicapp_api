import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/ban-types
export const generateToken = (res: Response, data: {}) => {
  const token = jwt.sign(data, process.env.JWT_SECRET || '', {
    expiresIn: process.env.TOKEN_EXPIRES
  });
  res.cookie('token', token, {
    maxAge: 86400000, // 24 hrs
    secure: true, // if SSL is implemented than true
    httpOnly: true,
    sameSite: 'none'
  });

  return token;
};

export const generateCustomJwt = (payload: object, options: SignOptions) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, options);
};
