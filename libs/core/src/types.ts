export interface IFeedData {
  link?: string;
  title?: string;
  description?: string;
  generator?: string;
  language?: string;
  published?: Date;
  entries?: Array<any>;
}

export interface IEpisode {
  podcastTitle: string;
  podcastDescription: string;
  title: string;
  url: string;
  description: string;
  audioSource?: string;
  published: string;
  image?: string;
}

export interface IAggregatorFeedDefaultConfig {
  keyMapping: Record<string, string | string[]>;
}

export interface IAggregatorFeedConfig extends Partial<IAggregatorFeedDefaultConfig> {
  url: string;
}

export interface IFeed extends Required<IAggregatorFeedConfig> {
  data: IFeedData;
}

export interface IFeedEntry {
  title: string;
  link: string;
  description: string;
  published: string;
}

export interface IEpisodesData {
  episodes: IEpisode[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface IAggregatorConfig {
  feeds: IAggregatorFeedConfig[];
}

export interface IAggregatorMergedConfig {
  feeds: IFeed[];
}

export interface IAggregatorParams {
  offset?: number;
  limit?: number;
}
