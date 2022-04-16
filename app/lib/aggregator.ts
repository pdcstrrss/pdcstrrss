import { defaultsDeep, get, orderBy } from "lodash";
import type {
  Feed,
  Episode,
  AggregatorConfig,
  EpisodesData,
  AggregatorParams,
  AggregatorFeedDefaultConfig,
  AggregatorMergedConfig,
  FeedData,
} from "./types";
import { parseRSS } from "./rss";

const aggregatorFeedDefaultConfig: AggregatorFeedDefaultConfig = {
  keyMapping: {
    title: "title",
    description: "description",
    url: ["enclosure.@_url", "link"],
    published: "pubDate",
  },
};

const CONFIG: AggregatorConfig = {
  feeds: [
    {
      url: "https://shoptalkshow.com/feed/",
    },
    {
      url: "https://feed.syntax.fm/rss",
    },
  ],
};

const getFullConfig = (config: AggregatorConfig): AggregatorMergedConfig => {
  return {
    ...config,
    feeds: config.feeds.map((feed) => defaultsDeep(feed, aggregatorFeedDefaultConfig)),
  };
};

const getFeedsData = async (config: AggregatorMergedConfig): Promise<Feed[]> => {
  const feedsRss = await Promise.all(config.feeds.map((feed) => fetch(feed.url).then((res) => res.text())));
  return feedsRss
    .map(parseRSS)
    .filter((feedRssObj) => !!feedRssObj)
    .map((data: any, index) => ({
      ...config.feeds[index],
      data,
    }));
};

export const getEpisodes = async (feeds: Feed[], offset = 0, limit = 10): Promise<EpisodesData> => {
  const allEpisodes = feeds
    .reduce((previousEpisodes, currentFeed) => {
      if (!currentFeed?.data?.entries) {
        return previousEpisodes;
      }

      const entries = currentFeed.data.entries.map((entry: any) => {
        const episodeData: any = Object.entries(currentFeed.keyMapping).reduce(
          (acc, [episodeDataKey, feedEntryKey]) => {
            if (feedEntryKey instanceof Array) {
              const feedEntryKeyWithValueIndex = feedEntryKey.findIndex((key) => get(entry, key));
              if (feedEntryKeyWithValueIndex !== -1) {
                return {
                  ...acc,
                  [episodeDataKey]: get(entry, feedEntryKey[feedEntryKeyWithValueIndex]),
                };
              }
            }

            return {
              ...acc,
              [episodeDataKey]: get(entry, feedEntryKey),
            };
          },
          {}
        );

        return {
          podcastTitle: currentFeed.data.title,
          podcastDescription: currentFeed.data.description,
          ...episodeData,
        };
      });
      return previousEpisodes.concat(entries);
    }, [] as Episode[])
    .map(({ published, ...episode }) => ({ ...episode, published: new Date(published).toJSON() }));
  const orderedData = orderBy(allEpisodes, ["published"], ["desc"]);
  const data = orderedData.filter((_, index) => index >= offset && index < limit);
  return { data, totalCount: allEpisodes.length, limit, offset };
};

export default async ({ offset, limit }: AggregatorParams = {}) => {
  const fullConfig = getFullConfig(CONFIG);
  const feeds = await getFeedsData(fullConfig);
  const episodes = await getEpisodes(feeds, offset, limit);
  return { feeds, episodes };
};
