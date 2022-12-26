import type { Feed } from '@prisma/client';
import { db } from '@pdcstrrss/database';
import defaultsDeep from 'lodash/defaultsDeep';
import { IRepositoryFilters, IRequiredRepositoryFilters } from '..';
import { aggregateFeedsAndEpisodes } from '../aggregator';

export type IFeed = Feed & {
  image?: string;
  latestEpisodePublished: Date;
};

const defaultGetFeedsParams = {
  offset: 0,
  limit: 10,
  orderBy: {
    title: 'asc',
  },
};

export interface IGetFeedParams {
  userId?: string;
}

export type IGetFeedsParams = IRepositoryFilters & IGetFeedParams;

export interface IGetFeedsData extends Omit<IRequiredRepositoryFilters<IGetFeedsParams>, 'orderBy'> {
  feeds: Feed[];
  totalCount: number;
}

export interface IGetFeedsOfUserData extends Omit<IRequiredRepositoryFilters<IGetFeedsParams>, 'orderBy'> {
  feeds: IFeed[];
  totalCount: number;
}

export const FREE_FEED_THRESHOLD = 3;

export async function getFeeds(params?: IGetFeedsParams): Promise<Feed[]> {
  const { userId, offset, limit, orderBy } = defaultsDeep(params, defaultGetFeedsParams);
  return db.feed.findMany({
    where: { users: { every: { userId } } },
    orderBy,
    take: limit,
    skip: offset,
  });
}

export async function getFeedUrls(): Promise<
  {
    id: string;
    url: string;
  }[]
> {
  return db.feed.findMany({
    select: { id: true, url: true },
  });
}

export async function getFeedById(feedId: string, params?: IGetFeedParams): Promise<Feed | null> {
  if (params?.userId) {
    const feedOfUser = await db.feedsOfUsers.findUnique({
      where: { userId_feedId: { userId: params.userId, feedId } },
      include: { feed: true },
    });
    return feedOfUser?.feed || null;
  }
  return db.feed.findUnique({ where: { id: feedId }, include: { users: true } });
}

export async function getFeedByUrl(url: string, { userId }: IGetFeedParams): Promise<Feed | null> {
  return db.feed.findUnique({ where: { url: url } });
}

export function getTotalFeedCount(userId?: string) {
  return db.feed.count({
    ...(userId && { where: { users: { every: { userId } } } }),
  });
}

export async function getFeedsData(params?: IGetFeedsParams): Promise<IGetFeedsData> {
  const { userId, offset, limit, orderBy } = defaultsDeep(params, defaultGetFeedsParams);
  const feeds = await getFeeds({ userId, offset, limit, orderBy });
  const totalCount = await getTotalFeedCount(userId);
  return { feeds, totalCount, limit, offset };
}

export async function getFeedsOfUser(params?: IGetFeedsParams): Promise<IGetFeedsOfUserData> {
  const { userId, orderBy, offset, limit } = defaultsDeep(params, defaultGetFeedsParams);

  const allFeedsOfUser = await db.feed.findMany({
    where: { users: { some: { userId } } },
    include: {
      episodes: {
        select: {
          image: true,
          published: true,
        },
        orderBy: {
          published: 'desc',
        },
        take: 1,
      },
    },
  });

  const totalCount = allFeedsOfUser.length;
  const feeds = allFeedsOfUser
    .map(({ episodes, ...feed }) => ({
      ...feed,
      image: episodes[0].image || undefined,
      latestEpisodePublished: episodes[0].published,
    }))
    .filter((_, index) => index >= offset && index < limit);
  return { feeds, totalCount, limit, offset };
}

interface IAssignFeedToUserParams {
  feedIds: string[];
  userId: string;
}

export async function addFeedsToUser({ feedIds, userId }: IAssignFeedToUserParams) {
  const episodesOfFeeds = await db.episode.findMany({ where: { feedId: { in: feedIds } } });
  await db.$transaction([
    db.feedsOfUsers.createMany({
      skipDuplicates: true,
      data: feedIds.map((feedId) => ({
        userId,
        feedId,
      })),
    }),
    db.episodesOfUsers.createMany({
      skipDuplicates: true,
      data: episodesOfFeeds.map(({ id }) => ({
        userId,
        episodeId: id,
      })),
    }),
  ]);
}

export async function deleteFeedsOfUser({ feedIds, userId }: IAssignFeedToUserParams) {
  await Promise.all(
    feedIds.map(async (feedId) =>
      db.$transaction([
        db.episodesOfUsers.deleteMany({
          where: {
            userId,
            episode: {
              feedId,
            },
          },
        }),
        db.feedsOfUsers.deleteMany({
          where: { userId, feedId },
        }),
      ])
    )
  );
}

export async function createFeedByUrl(url: string) {
  const feedIds = await aggregateFeedsAndEpisodes({ feeds: [{ url }] });
  if (feedIds.length === 0) return null;
  return getFeedById(feedIds[0]);
}

export async function exceedsFreeFeedThreshold({ userId }: { userId: string }) {
  const feedCount = await db.feed.count({ where: { users: { some: { userId } } } });
  return feedCount < FREE_FEED_THRESHOLD;
}
