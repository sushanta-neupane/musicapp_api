import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { DownloadQueryTypes } from './music.types';
import ytdl from '@distube/ytdl-core';

export const downloadHandller = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query: DownloadQueryTypes = req.query as unknown as DownloadQueryTypes;
    const info = await ytdl.getInfo(query.query!.toString());
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    // console.log(audioFormats);

    req.videoInfo = {
      title: 'abcd',
      url: 'abcd',
      test: audioFormats
    };

    next();
  }
);
