import * as musicLib from './music.libs';
import {
  DetailsQueryTypes,
  DiscoverQueryTypes,
  DownloadQueryTypes,
  SearchQueryTypes
} from './music.types';
import { PLAYLIST_IDS } from './music.utils';

export const getMusic = async (query: SearchQueryTypes) => {
  let data;

  const limit = query.limit ?? 10;
  const page = query.page ?? 1;
  const isPlaylist = query.isPlaylist === 'true';

  switch (query.platform) {
    case 'saavn':
      data = await musicLib.searchSongsFromSaavn(query.query, page, limit);
      data = data.data.results;
      break;
    case 'yt':
      if (isPlaylist) {
        data = await musicLib.getYtVideosByPlaylistId(query.query);
      } else {
        data = await musicLib.searchByQueryYt(query.query);
      }
      break;
    case 'shazam':
      data = await musicLib.searchMusicFromShazam(query.query, limit);
      data = data.tracks;

      break;
    default:
      data = await musicLib.searchByQueryYt(query.query);
  }

  return { results: data, platform: query.platform ?? 'yt' };
};

export const getMusicDiscover = async (query: DiscoverQueryTypes) => {
  const filter = query.filter || null;
  const platform = query.platform;
  let data;
  switch (platform) {
    case 'saavn':
      data = await musicLib.discoverSongFromSaavn(filter);
      break;
    case 'yt':
      data = await musicLib.getYtVideosByCategory(filter as keyof typeof PLAYLIST_IDS);
      break;
    default:
      data = await musicLib.getYtVideosByCategory(filter as keyof typeof PLAYLIST_IDS);
  }
  return { data, platform: platform };
};

export const getMusicDetails = async (query: DetailsQueryTypes) => {
  let data;
  switch (query.platform) {
    case 'saavn':
      data = await musicLib.musicByIdFromSaavn(query.id);
      data = data.data;
      break;
    case 'yt':
      data = await musicLib.getByYtVideoId(query.id);
      break;
    case 'shazam':
      data = await musicLib.aboutMusicFromShazam(query.id);
      break;
    default:
      data = await musicLib.getByYtVideoId(query.id);
  }
  return { results: data, platform: query.platform ?? 'yt' };
};

export const downloadMusic = async (query: DownloadQueryTypes) => {
  return {};
};
