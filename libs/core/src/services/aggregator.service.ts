import { defaultsDeep, get, orderBy } from 'lodash';
import type {
  IFeed,
  IEpisode,
  IAggregatorConfig,
  IEpisodesData,
  IAggregatorParams,
  IAggregatorFeedDefaultConfig,
  IAggregatorMergedConfig,
} from '../types';
import { parseRSS } from './rss.service';

const aggregatorFeedDefaultConfig: IAggregatorFeedDefaultConfig = {
  keyMapping: {
    title: 'title',
    description: 'description',
    url: ['enclosure.@_url', 'link'],
    published: 'pubDate',
    image: ["['itunes:image']['@_href']", 'image.url'],
  },
};

const CONFIG: IAggregatorConfig = {
  feeds: [
    {
      url: 'https://shoptalkshow.com/feed/',
    },
    {
      url: 'https://feed.syntax.fm/rss',
    },
    {
      url: 'https://feeds.soundcloud.com/users/soundcloud:users:293803449/sounds.rss',
    },
    {
      url: 'https://changelog.com/jsparty/feed',
    },
    {
      url: 'https://changelog.com/podcast/feed',
    },
    {
      url: 'https://feed.podbean.com/thedownbeat/feed.xml',
    },
  ],
};

const getFullConfig = (config: IAggregatorConfig): IAggregatorMergedConfig => {
  return {
    ...config,
    feeds: config.feeds.map((feed) => defaultsDeep(feed, aggregatorFeedDefaultConfig)),
  };
};

const getFeedsData = async (config: IAggregatorMergedConfig): Promise<IFeed[]> => {
  const feedsRss = await Promise.all(config.feeds.map((feed) => fetch(feed.url).then((res) => res.text())));
  return feedsRss
    .map(parseRSS)
    .filter((feedRssObj) => !!feedRssObj)
    .map((data: any, index: number) => ({
      ...config.feeds[index],
      data,
    }));
};

export const getEpisodes = async (feeds: IFeed[], offset = 0, limit = 10): Promise<IEpisodesData> => {
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
              [episodeDataKey]: get(entry, feedEntryKey as string),
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
    }, [] as IEpisode[])
    .map(({ published, ...episode }: IEpisode) => ({
      ...episode,
      published: new Date(published).toJSON(),
    }));
  const orderedData = orderBy(allEpisodes, ['published'], ['desc']);
  const data = orderedData.filter((_, index) => index >= offset && index < limit);
  return { episodes: data, totalCount: allEpisodes.length, limit, offset };
};

export async function aggregateEpisodesAndFeeds({ offset, limit }: IAggregatorParams = {}) {
  const fullConfig = getFullConfig(CONFIG);
  const feedsData = await getFeedsData(fullConfig);
  const episodesData = await getEpisodes(feedsData, offset, limit);
  return { feedsData, episodesData };
}
