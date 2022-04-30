import { db, Feed } from '@pdcstrrss/database';
import { defaultsDeep } from 'lodash';
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

export async function getFeeds(params?: IGetFeedsParams): Promise<Feed[]> {
  const { userId, offset, limit, orderBy } = defaultsDeep(params, defaultGetFeedsParams);
  return db.feed.findMany({
    where: { users: { every: { userId } } },
    orderBy,
    take: limit,
    skip: offset,
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
  await Promise.all(
    feedIds.map(async (feedId) => {
      return db.$transaction([
        db.feedsOfUsers.create({ data: { userId, feedId } }),
        db.episodesOfUsers.createMany({
          data: episodesOfFeeds.map(({ id }) => ({
            userId,
            episodeId: id,
          })),
        }),
      ]);
    })
  );
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
  return getFeedById(feedIds[0]);
}
