import { Favorite } from '@prisma/client';
import * as favServices from './fav.services';
import { sendSuccessRes } from '../utils/formateResponse';
import { catchAsync } from '../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const favContAddFav = catchAsync(async (req: Request, res: Response) => {
  const favData = req.body as Favorite;
  const returningData = await favServices.addFav(favData);
  return sendSuccessRes(StatusCodes.OK)(res, 'Added to Fav Successfully')(returningData);
});

export const favContRemoveFav = catchAsync(async (req: Request, res: Response) => {
  const favData = req.body as Favorite;
  const returningData = await favServices.removeFav(favData);
  return sendSuccessRes(StatusCodes.OK)(res, 'Remove From Fav Successfully')(returningData);
});

export const favContToggleFav = catchAsync(async (req: Request, res: Response) => {
  const favData = req.body as Favorite;
  const returningData = await favServices.toggleFav(favData);
  return sendSuccessRes(StatusCodes.OK)(res, 'Fav Toggled Successfully')(returningData);
});

export const favContListFav = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.decoded!;
  const returningData = await favServices.listFav(id);
  return sendSuccessRes(StatusCodes.OK)(res, 'Fav Listed Successfully')(returningData);
});

export const favContClearFav = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.decoded!;
  const returningData = await favServices.clearFav(id);
  return sendSuccessRes(StatusCodes.OK)(res, 'all Fav Cleared  Successfully')(returningData);
});
