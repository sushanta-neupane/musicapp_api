import { Playlist, Prisma } from '@prisma/client';
import db from '../db';

// Create Playlist
export const createPlaylist = async (data: Playlist) => {
  // Ensure that songs are correctly typed as Prisma.JsonArray
  data.songs = data.songs as Prisma.JsonArray;
  return db.playlist.create({ data });
};

// Delete Playlist
export const deletePlaylist = async (id: string) => {
  return db.playlist.delete({
    where: { id }
  });
};

// Add Song to Playlist
export const addSongToPlaylist = async (playlistId: string, song: any) => {
  // Fetch the current playlist data
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId }
  });

  if (!playlist) {
    throw new Error('Playlist not found');
  }

  if (!Array.isArray(playlist.songs)) {
    throw new Error('Songs data is not in an array format');
  }

  // Check if the song already exists in the playlist based on musicId
  const songExists = playlist.songs.some(
    (existingSong: any) => existingSong.musicId === song?.musicId
  );

  if (songExists) {
    throw new Error('Song already exists in the playlist');
  }

  // Add the new song to the songs array
  const updatedSongs = [...playlist.songs, song];

  // Update the playlist with the new songs array
  return db.playlist.update({
    where: { id: playlistId },
    data: {
      songs: updatedSongs
    }
  });
};

// Add Multiple Songs to Playlist
export const addMultipleSongsToPlaylist = async (playlistId: string, songs: object[]) => {
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId }
  });

  if (!playlist) {
    throw new Error('Playlist not found');
  }

  // If songs is null or undefined, treat it as an empty array
  const existingSongs = Array.isArray(playlist.songs) ? playlist.songs : [];

  // Filter out songs that already exist in the playlist based on musicId
  const filteredSongs = songs.filter((newSong: any) => {
    return !existingSongs.some((existingSong: any) => existingSong.id === newSong.id);
  });

  // If no songs are added (i.e., all songs already exist), throw an error
  if (filteredSongs.length === 0) {
    throw new Error('All provided songs are already in the playlist');
  }

  // Merge the new filtered songs with the existing songs
  const updatedSongs = [...existingSongs, ...filteredSongs];

  // Update the playlist with the new songs array
  return db.playlist.update({
    where: { id: playlistId },
    data: {
      songs: updatedSongs
    }
  });
};

// Remove Song from Playlist
export const removeSongFromPlaylist = async (playlistId: string, musicId: string) => {
  // Get the current playlist
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId }
  });

  if (!playlist) {
    throw new Error('Playlist not found');
  }
  if (!Array.isArray(playlist.songs)) {
    throw new Error('Songs data is not in an array format');
  }

  const updatedSongs = playlist.songs.filter((song: any) => song.musicId !== musicId);

  return db.playlist.update({
    where: { id: playlistId },
    data: {
      songs: updatedSongs
    }
  });
};

// Get User Playlists
export const getUserPlaylists = async (userId: string) => {
  return db.playlist.findMany({
    where: { userId }
  });
};

// Get Playlist Details
export const getPlaylistDetails = async (playlistId: string) => {
  return db.playlist.findUnique({
    where: { id: playlistId }
  });
};
export const getPlaylistFromSong = async (userId: string, musicId: string) => {
  try {
    const playlists = await db.playlist.findMany({
      where: { userId }
    });

    const filteredPlaylists = playlists.filter((playlist) => {
      if (playlist.songs && Array.isArray(playlist.songs)) {
        return playlist.songs.some((song) => {
          const songData = song as { musicId: string };
          return songData.musicId === musicId;
        });
      }
      return false;
    });

    return filteredPlaylists;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw new Error('Failed to fetch playlists.');
  }
};
