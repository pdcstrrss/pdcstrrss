// TODO: Stick in background function
import type { Prisma, Feed } from '@prisma/client';
import { db } from '@pdcstrrss/database';
import objectHash from 'object-hash';
import { isValid } from 'date-fns';
import { IRssFeedData, parseRSS } from '../rss/rss.service.js';
import { defaultsDeep } from 'lodash';
import { get, partition } from 'lodash';
import { linkUnlinkedEpisodes } from '../episode/index.js';
import { getFeedUrls } from '../feed/index.js';

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

export interface IFeedIdsWithEntries {
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

export const getFullConfig = (config: IAggregatorConfig): IAggregatorMergedConfig => {
  return {
    ...config,
    feeds: config.feeds.map((feed) => defaultsDeep(feed, aggregatorFeedDefaultConfig)),
  };
};

export const getFeedsFromRss = async (config: IAggregatorMergedConfig): Promise<IGetFeedData[]> => {
  const feedsRss = await Promise.allSettled(config.feeds.map((feed) => fetch(feed.url).then((res) => res.text())));

  feedsRss.forEach((feedRss, index) => {
    if (feedRss.status === 'rejected')
      console.error({ config: config.feeds[index], reason: (feedRss as PromiseRejectedResult).reason });
  });

  return (
    feedsRss
      .filter((feedRss) => feedRss.status === 'fulfilled')
      .map((feedRss) => parseRSS((feedRss as PromiseFulfilledResult<string>).value))
      .filter((feedRssObj) => !!feedRssObj)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((data: any, index: number) => ({
        ...config.feeds[index],
        ...data,
      }))
  );
};

export async function saveFeeds(feeds: IGetFeedData[]): Promise<IFeedIdsWithEntries[]> {
  const { default: pMap } = await import('p-map');

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

export async function getEpisodesToUpsert(episodes: IEpisodeFromFeed[]) {
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
      title: `${title}`,
      description: `${description}`,
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

  return { changedEpisodesToUpdate, episodesToCreate };
}

export async function saveEpisodes(episodes: IEpisodeFromFeed[]): Promise<void> {
  const { changedEpisodesToUpdate, episodesToCreate } = await getEpisodesToUpsert(episodes);
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

export const getEpisodesFromFeedIdsWithEntries = async (feeds: IFeedIdsWithEntries[]) => {
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
  if (!feeds.length) return [];
  const feedIdsWithEntries = await saveFeeds(feeds);
  const episodesFromFeeds = await getEpisodesFromFeedIdsWithEntries(feedIdsWithEntries);
  await saveEpisodes(episodesFromFeeds);
  return feedIdsWithEntries.map(({ feedId }) => feedId);
}

export async function aggregateNewEpisodes({ feedIds }: { feedIds?: Feed['id'][] } = {}) {
  const feedIdNUrls = await getFeedUrls({ ids: feedIds });
  const fullConfig = getFullConfig({ feeds: feedIdNUrls.map(({ url }) => ({ url })) });
  const feedsData = await getFeedsFromRss(fullConfig);
  if (!feedsData.length) throw new Error('No feeds found');
  const feedIdsWithEntries = feedsData.reduce((acc, feedData) => {
    const feedIdNUrl = feedIdNUrls.find(({ url }) => url === feedData.url);
    if (!feedIdNUrl) return acc;
    return [...acc, { feedId: feedIdNUrl.id, entries: feedData.entries, keyMapping: feedData.keyMapping }];
  }, [] as IFeedIdsWithEntries[]);
  const episodesFromFeeds = await getEpisodesFromFeedIdsWithEntries(feedIdsWithEntries);
  await saveEpisodes(episodesFromFeeds);
  const linkedEpisodesCount = await linkUnlinkedEpisodes();
  return { episodesCount: episodesFromFeeds.length, feedCount: feedIdsWithEntries.length, linkedEpisodesCount };
}
