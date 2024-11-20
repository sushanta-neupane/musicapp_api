import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { sendFailureRes } from '../utils/formateResponse';
import * as userServices from '../users/users.services';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers['authorization'] || req.cookies['token'];
    if (!token) {
      return sendFailureRes(HttpStatus.FORBIDDEN)(res, 'FORBIDDEN')({});
    }

    if (token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const id = decoded.id;
    const user = await userServices.getUserById(id);

    req.decoded = user!;

    return next();
  } catch (err) {
    return next(err);
  }
};

export const verifyCustomJwt = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
