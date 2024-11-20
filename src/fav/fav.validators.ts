import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { validate } from '../utils/validate';
import { Favorite } from '@prisma/client';
import { addFavSchema, removeFavSchema, toggleFavSchema } from './fav.schemas';

export const favAddValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.decoded!;
    req.body = { ...req.body, userId };
    await validate<Favorite>(req.body, addFavSchema);

    return next();
  }
);

export const favRemoveValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.decoded!;
    req.body = { ...req.body, userId };
    await validate<Favorite>(req.body, removeFavSchema);

    return next();
  }
);
export const favToggleValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.decoded!;
    req.body = { ...req.body, userId };
    await validate<Favorite>(req.body, toggleFavSchema);

    return next();
  }
);
