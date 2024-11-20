import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const checkDublicateSongs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { songs } = req.body;

    // Check if songs is an array and has at least one song
    if (Array.isArray(songs) && songs.length > 1) {
      const musicIds = new Set();

      // Iterate through the songs array
      for (const song of songs) {
        const { musicId } = song;

        // Check if musicId is already in the set
        if (musicIds.has(musicId)) {
          // If duplicate found, throw an error
          throw new Error(`Duplicate song with musicId: ${musicId}`);
        }

        // Add the musicId to the set
        musicIds.add(musicId);
      }
    }

    // Proceed to the next middleware if no duplicates
    next();
  }
);
