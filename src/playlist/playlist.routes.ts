import { Router } from 'express';
import {
  playlistContAddMultipleSongs,
  playlistContAddSong,
  playlistContCreate,
  playlistContDelete,
  playlistContDetails,
  playlistContGetPlaylistFromSong,
  playlistContList,
  playlistContRemoveSong
} from './playlist.controllers';
import { verifyToken } from '../middlewares/verifyToken';
import {
  playlistCreateValidator,
  playlistDeleteValidator,
  playlistAddValidator,
  playlistRemoveValidator,
  playlistAddMultipleValidator,
  getSongInPlaylistValidator
} from './playlist.validators';
import { checkDublicateSongs } from './playlist.middleware';

const router = Router();

// POST /api/playlist/create
router.post('/create', verifyToken, playlistCreateValidator, playlistContCreate);

// POST /api/playlist/delete
router.post('/delete', verifyToken, playlistDeleteValidator, playlistContDelete);

// POST /api/playlist/add
router.post('/add', verifyToken, playlistAddValidator, playlistContAddSong);

// POST /api/playlist/add_multiple
router.post(
  '/add_multiple',
  verifyToken,
  playlistAddMultipleValidator,
  checkDublicateSongs,
  playlistContAddMultipleSongs
);

// POST /api/playlist/remove
router.post('/remove', verifyToken, playlistRemoveValidator, playlistContRemoveSong);

// POST /api/playlist/get_playlist_from_song
router.post(
  '/get_playlists_from_song',
  verifyToken,
  getSongInPlaylistValidator,
  playlistContGetPlaylistFromSong
);

// GET /api/playlist/my_playlist
router.get('/my_playlist', verifyToken, playlistContList);

// GET /api/playlist/my_playlist/:id
router.get('/my_playlist/:id', verifyToken, playlistContDetails);

export default router;
