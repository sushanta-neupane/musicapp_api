import * as musicLib from './music.libs';
import { DownloadQueryTypes, SearchQueryTypes } from './music.types';

export const getMusic = async (query: SearchQueryTypes) => {
  const data = await musicLib.searchMusicFromShazam(query.query, query.limit!);
  return data;
};

export const downloadMusic = async (query: DownloadQueryTypes) => {
  return {};
};
