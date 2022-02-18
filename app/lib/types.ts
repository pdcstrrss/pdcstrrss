import type { FeedData } from "feed-reader";

export interface Episode {
  podcastTitle: string;
  podcastDescription: string;
  title: string;
  url: string;
  description: string;
  audioSource?: string;
  published: string;
}

export interface Feed {
  url: string;
  audioSourceSelector: string;
  keyMapping: Record<string, string>;
  data: FeedData;
}

export interface FeedEntry {
  title: string;
  link: string;
  description: string;
  published: string;
}
