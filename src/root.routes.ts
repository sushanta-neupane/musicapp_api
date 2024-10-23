import Router, { Request, Response } from 'express';
import musicRouter from './music/music.routes';
import multer from 'multer';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Api is working . Looks to docs to use.');
});

router.use('/music', musicRouter);
