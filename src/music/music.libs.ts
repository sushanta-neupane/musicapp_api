import { internal } from '@hapi/boom';
import axios from 'axios';
import yts from 'yt-search';
import ytdl from '@distube/ytdl-core';
import { PLAYLIST_IDS } from './music.utils';
import { playlist_info } from 'play-dl';
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
    const videoInfo = await playlist_info(listId);
    await videoInfo.fetch();
    const playlistInfo = {
      playlistThumbnail: videoInfo.thumbnail,
      playlistName: videoInfo.title,
      count: videoInfo.total_pages
    };
    const allVideos = await videoInfo.all_videos();
    return { allVideos, playlistInfo };
  } catch (error) {
    throw internal('Error on search', error);
  }
};

export const getYtVideosByCategory = async (category: keyof typeof PLAYLIST_IDS | null) => {
  if (!category) {
    throw internal(`Provide category`);
  }
  const listId = PLAYLIST_IDS[category];

  if (!listId) {
    throw internal(`Playlist ID not found for category: ${category}`);
  }

  try {
    const response = await getYtVideosByPlaylistId(listId);
    return response;
  } catch (error) {
    throw internal(`Error fetching videos for category ${category}`);
  }
};

export const getByYtVideoId = async (videoId: string) => {
  try {
    const videoInfo = await ytdl.getInfo(videoId);

    const music_url = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' }).url;
    const relatedVideos = videoInfo.related_videos;
    const details = await yts({ videoId }); // Assuming you get additional details from yts

    // Combine the results into one response object
    const response = {
      music_url,
      relatedVideos,
      details
    };

    return response;
  } catch (error) {
    throw internal('Error on search', error);
  }
};

// saavn api

// Function to handle trending song and albumb from saavn
export const discoverSongFromSaavn = async (q: string | null) => {
  const path = `https://jiosaavn-api-sigma-sandy.vercel.app/modules?language=english,hindi`;
  const saavnData = await axios.get(`${path}`);
  if (q) {
    return saavnData.data.data[q];
  }
  return saavnData.data.data;
};

const searchFromSaavn = async (path: string) => {
  const saavnData = await axios.get(`https://saavn.dev/api${path}`);
  console.log(`https://saavn.dev/api${path}`);
  return saavnData.data;
};

// Function to handle songs search from saavn
export const searchSongsFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/search/songs?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

// Function to handle albums search from saavn
export const searchAlbumsFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/search/albums?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

// Function to handle playlists search from saavn
export const searchPlaylistsFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/search/playlists?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

// Function to handle artist search from saavn
export const searchArtistsFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/search/artists?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

// General search function from saavn
export const generalSearchFromSaavn = async (q: string, page: number, limit: number) => {
  const path = `/search?query=${q}&page=${page}&limit=${limit}`;
  return await searchFromSaavn(path);
};

export const musicByIdFromSaavn = async (id: string) => {
  const path = `/songs/${id}`;
  return await searchFromSaavn(path);
};

export const musicLyricsByIdFromSaavn = async (id: string) => {
  const path = `/songs/${id}/lyrics`;
  return await searchFromSaavn(path);
};

export const musicSuggestionByIdFromSaavn = async (id: string) => {
  const path = `/songs/${id}/suggestions`;
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

export const aboutMusicFromShazam = async (id: string) => {
  try {
    // Make the two requests concurrently
    const [shazamResponse, related_videos] = await Promise.all([
      axios.get(
        `https://www.shazam.com/discovery/v5/en/GB/web/-/track/${id}?shazamapiversion=v3&video=v3`
      ),
      getRelatedSongsFromShazam(id)
    ]);
    const relatedVideos = related_videos.tracks;

    // Add the related videos to the main Shazam data
    return {
      ...shazamResponse.data,
      relatedVideos
    };
  } catch (error) {
    console.error('Error fetching Shazam data:', error);
    throw new Error('Failed to fetch Shazam music data');
  }
};

export const getRelatedSongsFromShazam = async (id: string, limit = 50) => {
  try {
    const shazamData = await axios.get(
      `https://cdn.shazam.com/shazam/v3/en-US/GB/web/-/tracks/track-similarities-id-${id}?startFrom=0&pageSize=${limit}&connected=&channel=`
    );
    // Returning only the relevant data to avoid unnecessary details
    return shazamData.data || [];
  } catch (error) {
    console.error('Error fetching related songs from Shazam:', error);
    throw new Error('Failed to fetch related songs');
  }
};
