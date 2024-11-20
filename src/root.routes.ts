import Router, { Request, Response } from 'express';
import musicRouter from './music/music.routes';
import userRouter from './users/users.routes';
import favRouter from './fav/fav.routes';
import playlistRouter from './playlist/playlist.routes';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Api is working . Looks to docs to use.');
});

router.use('/music', musicRouter);

router.use('/users', userRouter);

router.use('/fav', favRouter);

router.use('/playlist', playlistRouter);
