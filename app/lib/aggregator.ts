import { read } from "feed-reader";
import type { FeedData } from "feed-reader";
import get from "lodash/get";
import type { Feed, Episode } from "./types";

const _config = {
  feeds: [
    {
      url: "https://shoptalkshow.com/feed/",
      audioSourceSelector: "audio",
      keyMapping: {
        title: "title",
        description: "description",
        url: "link",
        published: "published",
      },
    },
  ],
};

const getFeedsData = (config: typeof _config): Promise<Feed[]> =>
  Promise.all(
    config.feeds.map(async (feed) => {
      const data = await read(feed.url);
      return {
        ...feed,
        data,
      };
    })
  );

export const getEpisodes = (feeds: Feed[], offset = 0, limit = 10) =>
  Promise.all(
    feeds
      .reduce((acc, feed) => {
        const entries = feed.data.entries.map((entry: any) => {
          const episodeData = Object.entries(feed.keyMapping).reduce((acc, [episodeDataKey, feedEntryKey]) => {
            return {
              ...acc,
              [episodeDataKey]: get(entry, feedEntryKey),
            };
          }, {});

          return {
            podcastTitle: feed.data.title,
            podcastDescription: feed.data.description,
            ...episodeData,
          };
        });
        return [...acc, ...entries];
      }, [] as Episode[])
      .filter((_, index) => index >= offset && index < limit)
  );

export default async () => {
  const feeds = await getFeedsData(_config);
  const episodes = await getEpisodes(feeds);
  return { feeds, episodes };
};
