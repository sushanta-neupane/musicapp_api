import Joi from 'joi';
import { SearchType } from '../types/music.types';
// Create Playlist Schema
export const createPlaylistSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  songs: Joi.array()
});

// Delete Playlist Schema
export const deletePlaylistSchema = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required()
});

// Add Song to Playlist Schema
export const addSongSchema = Joi.object({
  playlistId: Joi.string().required(),
  song: Joi.object()
});
export const addMultipleSongSchema = Joi.object({
  playlistId: Joi.string().required(),
  songs: Joi.array()
});

// Remove Song from Playlist Schema
export const removeSongSchema = Joi.object({
  playlistId: Joi.string().required(),
  musicId: Joi.string().required()
});

// getSongInPlaylist
export const getSongInPlaylistSchema = Joi.object({
  musicId: Joi.string().required()
});
