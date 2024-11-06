import { Router } from 'express';
import {
  musicContDownload,
  musicContRecognise,
  musicContSearch,
  musicDetails,
  musicDiscover
} from './music.controllers';

import * as queryValidator from './music.validators';
import { downloadHandller } from './music.middleware';
import { upload } from '../middlewares/upload';

const router = Router();

// GET /api/music/search
router.get('/search', queryValidator.querySearchValidator, musicContSearch);

// GET /api/music/details/123abc
router.get('/details/:id', queryValidator.queryDetailsValidator, musicDetails);

// GET /api/music/discover
router.get('/discover', queryValidator.queryDiscoverValidator, musicDiscover);

// GET /api/music/download
router.get('/download', queryValidator.queryDownloadValidator, downloadHandller, musicContDownload);

// GET /api/music/recognise
router.post('/recognise', upload.single('voice'), musicContRecognise);

export default router;
