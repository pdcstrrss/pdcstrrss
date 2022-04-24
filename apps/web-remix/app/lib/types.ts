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
  image?: string;
}

export interface AggregatorFeedDefaultConfig {
  keyMapping: Record<string, string | string[]>;
}

export interface AggregatorFeedConfig extends Partial<AggregatorFeedDefaultConfig> {
  url: string;
}

export interface Feed extends Required<AggregatorFeedConfig> {
  data: FeedData;
}

export interface FeedEntry {
  title: string;
  link: string;
  description: string;
  published: string;
}

export interface EpisodesData {
  episodes: Episode[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface AggregatorConfig {
  feeds: AggregatorFeedConfig[];
}

export interface AggregatorMergedConfig {
  feeds: Feed[];
}

export interface AggregatorParams {
  offset?: number;
  limit?: number;
}
