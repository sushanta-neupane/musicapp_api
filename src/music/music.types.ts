export interface SearchQueryTypes {
  query: string;
  page?: number;
  limit?: number;
}

export interface DownloadQueryTypes {
  query?: string;
  id?: string;
  type?: string;
}

export interface YtOutputTypes {
  title: string;
  url: string;
  test: any;
}
