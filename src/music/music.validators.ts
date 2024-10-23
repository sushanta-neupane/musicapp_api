import { NextFunction, Response, Request } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { DownloadQuerySchema, MusicQuerySchema } from './music.schemas';
import { validate } from '../utils/validate';
import { DownloadQueryTypes, SearchQueryTypes } from './music.types';

export const querySearchValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as unknown as SearchQueryTypes;
    query.page = Number(query.page) | 5;
    query.limit = Number(query.limit) | 20;
    await validate<SearchQueryTypes>(query, MusicQuerySchema);

    return next();
  }
);
export const queryDownloadValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as unknown as DownloadQueryTypes;
    await validate<DownloadQueryTypes>(query, DownloadQuerySchema);

    return next();
  }
);
