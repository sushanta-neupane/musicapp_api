export interface SearchQueryTypes {
  query: string;
  page?: number;
  limit?: number;
  platform?: string;
  isPlaylist?: string;
}

export interface DiscoverQueryTypes {
  filter?: string;
  platform: string;
}
export interface DetailsQueryTypes {
  id: string;
  platform: string;
}

export interface DownloadQueryTypes {
  id: string;
  platform: string;
}

export interface YtOutputTypes {
  title: string;
  url: string;
  test: any;
}
