import * as playlistServices from './playlist.services';
import { sendSuccessRes } from '../utils/formateResponse';
import { catchAsync } from '../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Playlist } from '@prisma/client';
import { imageUploader } from '../config/cloudinary';

export const playlistContCreate = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const playlist = await playlistServices.createPlaylist(data);
  return sendSuccessRes(StatusCodes.OK)(res, 'Playlist Created Successfully')(playlist);
});

// POST /api/playlist/delete
export const playlistContDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body; // Assuming id is passed to delete playlist
  const deletedPlaylist = await playlistServices.deletePlaylist(id);
  return sendSuccessRes(StatusCodes.OK)(res, 'Playlist Deleted Successfully')(deletedPlaylist);
});

// POST /api/playlist/add
export const playlistContAddSong = catchAsync(async (req: Request, res: Response) => {
  const { playlistId, song } = req.body; // Assuming playlistId and song data are in the request body
  const updatedPlaylist = await playlistServices.addSongToPlaylist(playlistId, song);
  return sendSuccessRes(StatusCodes.OK)(res, 'Song Added to Playlist Successfully')(
    updatedPlaylist
  );
});

// POST /api/playlist/add_multiple
export const playlistContAddMultipleSongs = catchAsync(async (req: Request, res: Response) => {
  const { playlistId, songs } = req.body; // Assuming playlistId and songs are in the request body
  const updatedPlaylist = await playlistServices.addMultipleSongsToPlaylist(playlistId, songs);
  return sendSuccessRes(StatusCodes.OK)(res, 'Multiple Songs Added to Playlist Successfully')(
    updatedPlaylist
  );
});

// POST /api/playlist/remove
export const playlistContRemoveSong = catchAsync(async (req: Request, res: Response) => {
  const { playlistId, musicId } = req.body; // Assuming playlistId and songId are provided
  const updatedPlaylist = await playlistServices.removeSongFromPlaylist(playlistId, musicId);
  return sendSuccessRes(StatusCodes.OK)(res, 'Song Removed from Playlist Successfully')(
    updatedPlaylist
  );
});

// POST /api/playlist/remove
export const playlistContGetPlaylistFromSong = catchAsync(async (req: Request, res: Response) => {
  const { musicId } = req.body;
  const { id: userId } = req.decoded!;
  const playlistList = await playlistServices.getPlaylistFromSong(userId, musicId);
  return sendSuccessRes(StatusCodes.OK)(res, `Playlist containing ${userId} fetched  Successfully`)(
    playlistList
  );
});

// GET /api/playlist/my_playlist
export const playlistContList = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.decoded!; // Assuming the user ID is decoded from the token
  const playlists = await playlistServices.getUserPlaylists(id);
  return sendSuccessRes(StatusCodes.OK)(res, 'User Playlists Retrieved Successfully')(playlists);
});

// GET /api/playlist/my_playlist/:id
export const playlistContDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // Assuming the playlist ID is passed in the URL
  const playlistDetails = await playlistServices.getPlaylistDetails(id);
  return sendSuccessRes(StatusCodes.OK)(res, 'Playlist Details Retrieved Successfully')(
    playlistDetails || {}
  );
});
