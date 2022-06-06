// TODO: Stick in background function
import { db, Prisma } from '@pdcstrrss/database';
import objectHash from 'object-hash';
import isValid from 'date-fns/isValid';
import pMap from 'p-map';
import { IRssFeedData, parseRSS } from '../rss/rss.service';
import defaultsDeep from 'lodash/defaultsDeep';
import partition from 'lodash/partition';
import get from 'lodash/get';

export interface IAggregatorFeedDefaultConfig {
  keyMapping: Record<string, string | string[]>;
}

export interface IAggregatorFeedConfig extends Partial<IAggregatorFeedDefaultConfig> {
  url: string;
}

export type IGetFeedData = Required<IAggregatorFeedConfig> & IRssFeedData;

export interface IFeedEntry {
  title: string;
  link: string;
  description: string;
  published: string;
}

export interface IAggregatorConfig {
  feeds: IAggregatorFeedConfig[];
}

export interface IAggregatorMergedConfig {
  feeds: IGetFeedData[];
}

type FeedKeyMapping = Record<string, string | string[]>;

interface IFeedIdsWithEntries {
  feedId: string;
  entries: any[] | undefined;
  keyMapping: FeedKeyMapping;
}

interface IEpisodeFromFeed {
  feedId: string;
  [x: string | number | symbol]: any;
}

interface IEpisodeToCompare {
  title: string;
  description: string | null;
  published: Date | string;
  url: string;
  image: string | null;
}

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

export const getFullConfig = (config: IAggregatorConfig): IAggregatorMergedConfig => {
  return {
    ...config,
    feeds: config.feeds.map((feed) => defaultsDeep(feed, aggregatorFeedDefaultConfig)),
  };
};

export const getFeedsFromRss = async (config: IAggregatorMergedConfig): Promise<IGetFeedData[]> => {
  const feedsRss = await Promise.all(config.feeds.map((feed) => fetch(feed.url).then((res) => res.text())));
  return feedsRss
    .map(parseRSS)
    .filter((feedRssObj) => !!feedRssObj)
    .map((data: any, index: number) => ({
      ...config.feeds[index],
      ...data,
    }));
};

export async function saveFeeds(feeds: IGetFeedData[]): Promise<IFeedIdsWithEntries[]> {
  const feedsToCreate = feeds.reduce((previousData, currentFeed) => {
    const { link, title, description, generator, language, url } = currentFeed;
    if (!title || !url) {
      return previousData;
    }
    return previousData.concat({
      link,
      title,
      description,
      generator,
      language,
      url,
    });
  }, [] as Prisma.FeedCreateManyInput[]);

  const feedIds = await pMap(
    feedsToCreate,
    async (data, index) => {
      const feed = await db.feed.upsert({ where: { url: data.url }, create: data, update: data });
      return { feedId: feed.id, entries: feeds[index].entries, keyMapping: feeds[index].keyMapping };
    },
    { concurrency: 10 }
  );

  return feedIds;
}

function compareEpisodes(a: IEpisodeToCompare, b: IEpisodeToCompare) {
  const aHash = objectHash(a);
  const bHash = objectHash(b);
  return aHash === bHash;
}

async function saveEpisodes(episodes: IEpisodeFromFeed[]): Promise<void> {
  const existingEpisodes = await db.episode.findMany({
    select: { title: true, description: true, published: true, url: true, image: true, feedId: true },
  });
  const episodesToUpsert = episodes.reduce((previousData, currentEpisode) => {
    const { title, description, published, url, feedId, image } = currentEpisode;
    const datePublished = isValid(new Date(published)) ? new Date(published) : undefined;

    if (!title || !url || !published || !datePublished) {
      return previousData;
    }

    const episode: Prisma.EpisodeCreateManyInput = {
      title,
      description,
      published: datePublished,
      url,
      image,
      feedId,
    };

    return previousData.concat(episode);
  }, [] as Prisma.EpisodeCreateManyInput[]);

  const [episodesToUpdate, episodesToCreate] = partition(episodesToUpsert, ({ url }) => {
    return existingEpisodes.find(({ url: existingEpisodeUrl }) => existingEpisodeUrl === url);
  });

  const changedEpisodesToUpdate = episodesToUpdate
    // .filter((_, index) => index === 0)
    .filter((episodeToUpsert) => {
      const { title, description = null, published, url, image = null } = episodeToUpsert;
      const existingEpisodeFound = existingEpisodes.find(({ url: existingEpisodeUrl }) => existingEpisodeUrl === url);
      if (!existingEpisodeFound) return false;
      const { feedId, ...existingEpisode } = existingEpisodeFound;
      const sameContent = compareEpisodes({ title, description, published, url, image }, existingEpisode);
      return !sameContent;
    });

  if (!changedEpisodesToUpdate && !episodesToCreate.length) return;

  await db.$transaction([
    ...changedEpisodesToUpdate.map((data) => {
      return db.episode.updateMany({ where: { url: data.url }, data });
    }),
    db.episode.createMany({ data: episodesToCreate }),
  ]);
}

function mapEpisodeKeys(entry: any, keyMapping: FeedKeyMapping) {
  const episodeData: any = Object.entries(keyMapping).reduce((acc, [episodeDataKey, feedEntryKey]) => {
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
  }, {});

  return episodeData;
}

const getEpisodesFromFeedIdsWithEntries = async (feeds: IFeedIdsWithEntries[]) => {
  return feeds.reduce((previousEpisodes, currentFeed) => {
    if (!currentFeed?.entries) {
      return previousEpisodes;
    }

    const entries = currentFeed.entries.map((entry: any) => {
      return {
        ...mapEpisodeKeys(entry, currentFeed.keyMapping),
        feedId: currentFeed.feedId,
      };
    });
    return previousEpisodes.concat(entries);
  }, [] as IEpisodeFromFeed[]);
};

export async function aggregateFeedsAndEpisodes(config: IAggregatorConfig) {
  const fullConfig = getFullConfig(config);
  const feeds = await getFeedsFromRss(fullConfig);
  const feedIdsWithEntries = await saveFeeds(feeds);
  const episodesFromFeeds = await getEpisodesFromFeedIdsWithEntries(feedIdsWithEntries);
  await saveEpisodes(episodesFromFeeds);
  return feedIdsWithEntries.map(({ feedId }) => feedId);
}
