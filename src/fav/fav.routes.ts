import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import {
  favContAddFav,
  favContClearFav,
  favContListFav,
  favContRemoveFav,
  favContToggleFav
} from './fav.controllers';
import { favAddValidator, favRemoveValidator, favToggleValidator } from './fav.validators';
const router = Router();

// POST /api/fav/add
router.post('/add', verifyToken, favAddValidator, favContAddFav);

// POST /api/fav/remove
router.post('/remove', verifyToken, favRemoveValidator, favContRemoveFav);

// POST /api/fav/toggle
router.post('/toggle', verifyToken, favToggleValidator, favContToggleFav);

// POST /api/fav/clear
router.post('/clear', verifyToken, favContClearFav);

// GET /api/fav/list
router.get('/list', verifyToken, favContListFav);

export default router;
