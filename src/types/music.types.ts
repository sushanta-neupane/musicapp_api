export interface SearchType {
  musicId: string;
  platform: string;
  title: string;
  artist: string;
  thumbnail: string;
}
export interface SongType extends SearchType {
  music_url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  related_videos: any[];
}
