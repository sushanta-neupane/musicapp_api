import { internal } from '@hapi/boom';
import axios from 'axios';
import yts from 'yt-search';

// youtube api

export const searchByQueryYt = async (query: string) => {
  try {
    const response = (await yts(query)).videos;
    return response;
  } catch (error) {
    throw internal('Error on search', error);
  }
};

export const getYtVideosByPlaylistId = async (listId: string) => {
  try {
    const response = await yts({ listId });
    return response;
  } catch (error) {
    throw internal('Error on search', error);
  }
};

export const getByYtVideoId = async (videoId: string) => {
  try {
    const response = await yts({ videoId });
    return response;
  } catch (error) {
    throw internal('Error on search', error);
  }
};

// saavn api
const searchFromSaavn = async (path: string) => {
  const saavnData = await axios.get(`https://saavn.dev${path}`);
  return saavnData.data;
};

// Function to handle songs search from saavn
export const searchSongsFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/api/search/songs?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

// Function to handle albums search from saavn
export const searchAlbumsFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/api/search/albums?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

// Function to handle playlists search from saavn
export const searchPlaylistsFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/api/search/playlists?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

// Function to handle artist search from saavn
export const searchArtistsFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/api/search/artists?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

// General search function from saavn
export const generalSearchFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/api/search?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

export const musicByIdFromSaavn = async (id: string) => {
  const path = `/api/songs/${id}`;
  return await searchFromSaavn(path);
};

export const musicLyricsByIdFromSaavn = async (id: string) => {
  const path = `/api/songs/${id}/lyrics`;
  return await searchFromSaavn(path);
};

export const musicSuggestionByIdFromSaavn = async (id: string) => {
  const path = `/api/songs/${id}/suggestions`;
  return await searchFromSaavn(path);
};

// shazam api
const searchFromShazam = async (path: string) => {
  const shazamData = await axios.get(`https://www.shazam.com/services${path}`);
  return shazamData.data;
};

export const searchMusicFromShazam = (query: string, limit: number) => {
  const path = `/search/v3/en-US/GB/web/search?query=${query}&numResults=${limit}&offset=0&types=songs`;
  return searchFromShazam(path);
};

export const searchArtistFromShazam = (query: string, limit: number) => {
  const path = `/search/v3/en-US/GB/web/search?query=${query}&numResults=${limit}&offset=0&types=artists`;
  return searchFromShazam(path);
};

export const searchArtistByIdFromShazam = (id: string) => {
  const path = ` /amapi/v1/catalog/GB/artists/${id}`;
  return searchFromShazam(path);
};

export const getRelatedSongsFromShazam = async (id: string, limit: number) => {
  const shazamData = await axios.get(
    `https://cdn.shazam.com/shazam/v3/en-US/GB/web/-/tracks/track-similarities-id-${id}?startFrom=0&pageSize=${limit}&connected=&channel=`
  );
  return shazamData.data;
};
