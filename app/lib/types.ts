export interface FeedData {
  link?: string;
  title?: string;
  description?: string;
  generator?: string;
  language?: string;
  published?: Date;
  entries?: Array<any>;
}

export interface Episode {
  podcastTitle: string;
  podcastDescription: string;
  title: string;
  url: string;
  description: string;
  audioSource?: string;
  published: string;
}

export interface FeedsConfig {
  url: string;
  audioSourceSelector: string;
  keyMapping: Record<string, string | string[]>;
}

export interface Feed extends FeedsConfig {
  data: FeedData;
}

export interface FeedEntry {
  title: string;
  link: string;
  description: string;
  published: string;
}

export interface EpisodesData {
  data: Episode[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface AggregatorConfig {
  feeds: FeedsConfig[];
}

export interface AggregatorParams {
  offset?: number;
  limit?: number;
}
