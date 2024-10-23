import { Router } from 'express';
import { musicContDownload, musicContRecognise, musicContSearch } from './music.controllers';

import * as queryValidator from './music.validators';
import { downloadHandller } from './music.middleware';
import { upload } from '../middlewares/upload';

const router = Router();

// GET /api/music/search
router.get('/search', queryValidator.querySearchValidator, musicContSearch);

router.get('/download', queryValidator.queryDownloadValidator, downloadHandller, musicContDownload);

router.post('/recognise', upload.single('voice'), musicContRecognise);

export default router;
