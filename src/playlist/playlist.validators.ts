import { validate } from '../utils/validate';
import {
  createPlaylistSchema,
  deletePlaylistSchema,
  addSongSchema,
  removeSongSchema,
  addMultipleSongSchema,
  getSongInPlaylistSchema
} from './playlist.schemas';
import { catchAsync } from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

export const playlistCreateValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.decoded!;
    req.body = { ...req.body, userId };
    await validate(req.body, createPlaylistSchema);
    next();
  }
);

export const playlistDeleteValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.decoded!;
    req.body = { ...req.body, userId };
    await validate(req.body, deletePlaylistSchema);
    next();
  }
);

export const playlistAddValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, addSongSchema);
    next();
  }
);
export const playlistAddMultipleValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, addMultipleSongSchema);
    next();
  }
);

export const playlistRemoveValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, removeSongSchema);
    next();
  }
);

export const getSongInPlaylistValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(req.body, getSongInPlaylistSchema);
    next();
  }
);
