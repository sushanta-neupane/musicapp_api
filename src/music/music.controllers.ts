import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { downloadMusic, getMusic, getMusicDetails, getMusicDiscover } from './music.services';
import {
  DetailsQueryTypes,
  DiscoverQueryTypes,
  DownloadQueryTypes,
  SearchQueryTypes
} from './music.types';
import { sendSuccessRes } from '../utils/formateResponse';
import { StatusCodes } from 'http-status-codes';
import ytdl from '@distube/ytdl-core';
// import { Shazam } from '../shazam/shazam.api';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import { Shazam } from 'node-shazam';

export const musicContSearch = catchAsync(async (req: Request, res: Response) => {
  const query: SearchQueryTypes = req.query as unknown as SearchQueryTypes;
  const data = await getMusic(query);
  return sendSuccessRes(StatusCodes.OK)(res, 'Music fetched')({ data });
});

export const musicDiscover = catchAsync(async (req: Request, res: Response) => {
  const query: DiscoverQueryTypes = req.query as unknown as DiscoverQueryTypes;
  const data = await getMusicDiscover(query);
  return sendSuccessRes(StatusCodes.OK)(res, 'Music fetched')(data);
});

export const musicDetails = catchAsync(async (req: Request, res: Response) => {
  const query: DetailsQueryTypes = req.query as unknown as DetailsQueryTypes;
  const data = await getMusicDetails(query);
  return sendSuccessRes(StatusCodes.OK)(res, 'Music fetched')(data);
});

export const musicContDownload = catchAsync(async (req: Request, res: Response) => {
  const query: DownloadQueryTypes = req.query as unknown as DownloadQueryTypes;
  const videoData = req.videoInfo;

  res.setHeader('Content-Disposition', `attachment; filename="${videoData?.title}.mp4"`);
  res.setHeader('Content-Type', 'video/mp4');

  ytdl(query.query!, { filter: (formate) => formate.hasAudio }).pipe(res);

  // return sendSuccessRes(StatusCodes.OK)(res, 'Music Downloaded')({ videoData });
});

export const musicContRecognise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Receiving and processing audio...');

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file or file path provided.' });
    }
    const tempFilePath = req.file.path;
    // const tempFilePath = path.join(__dirname, 'test.mp3');
    console.log(tempFilePath);

    console.log(`Processing file at: ${tempFilePath}`);

    try {
      // Ensure file exists before trying to recognize it
      if (!fs.existsSync(tempFilePath)) {
        return res.status(400).json({ message: 'Audio file not found.' });
      }

      // Initialize Shazam API and recognize the song
      const shazam = new Shazam();
      const songData = await shazam.recognise(tempFilePath, 'en-US');
      console.log(songData);
      // Return the recognized song data to the frontend
      res.json({ songData });
    } catch (error) {
      console.error('Error during recognition:', error);
      res.status(500).json({ message: 'Recognition failed, please try again.' });
    } finally {
      // Optionally clean up temp files
      try {
        if (fs.existsSync(tempFilePath)) {
          // fs.unlinkSync(tempFilePath);
          // Delete the temp file after processing
        }
      } catch (cleanupError) {
        console.error('Error during file cleanup:', cleanupError);
      }
    }
  }
);
