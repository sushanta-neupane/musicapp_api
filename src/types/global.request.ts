import { YtOutputTypes } from '../music/music.types';

declare global {
  namespace Express {
    export interface Request {
      videoInfo?: YtOutputTypes;
    }
  }
}
