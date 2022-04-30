import { db, Feed } from '@pdcstrrss/database';
import { defaultsDeep } from 'lodash';
import { IRepositoryFilters, IRequiredRepositoryFilters } from '..';

export type IFeed = Feed & {
  subscribed: boolean;
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

export interface IGetFeedsParams extends IRepositoryFilters {
  userId?: string;
}

export interface IGetFeedsData extends Omit<IRequiredRepositoryFilters<IGetFeedsParams>, 'orderBy'> {
  feeds: Feed[];
  totalCount: number;
}

export interface IGetFeedsSubscribedByUserData extends Omit<IRequiredRepositoryFilters<IGetFeedsParams>, 'orderBy'> {
  feeds: IFeed[];
  totalCount: number;
}

export async function getFeeds(params?: IGetFeedsParams): Promise<Feed[]> {
  const { userId, offset, limit, orderBy } = defaultsDeep(params, defaultGetFeedsParams);
  return db.feed.findMany({
    ...(userId && { where: { users: { every: { userId } } } }),
    orderBy,
    take: limit,
    skip: offset,
  });
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

export async function getFeedsSubscribedByUser(params?: IGetFeedsParams): Promise<IGetFeedsSubscribedByUserData> {
  const { userId, orderBy, offset, limit } = defaultsDeep(params, defaultGetFeedsParams);
  const allFeeds = await db.feed.findMany({
    orderBy,
    include: {
      users: true,
      episodes: {
        orderBy: {
          published: 'desc',
        },
        take: 1,
      },
    },
  });
  const totalCount = allFeeds.length;
  const feeds = allFeeds
    .map(({ users, episodes, ...feed }) => ({
      ...feed,
      subscribed: users.some((user) => user.userId === userId),
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

export async function toggleUserFeedSubscription({ feedIds, userId }: IAssignFeedToUserParams) {
  const episodesOfFeeds = await db.episode.findMany({ where: { feedId: { in: feedIds } } });

  await Promise.all(
    feedIds.map(async (feedId) => {
      const userIsSubscribedToFeed = !!(await db.feedsOfUsers.findUnique({
        where: { userId_feedId: { userId, feedId } },
      }));

      if (userIsSubscribedToFeed) {
        return db.$transaction([
          db.feedsOfUsers.deleteMany({
            where: { userId, feedId },
          }),
          db.episodesOfUsers.deleteMany({
            where: {
              userId,
              episode: {
                feedId,
              },
            },
          }),
        ]);
      } else {
        return db.$transaction([
          db.episodesOfUsers.createMany({
            data: episodesOfFeeds.map(({ id }) => ({
              userId,
              episodeId: id,
            })),
          }),
          db.feedsOfUsers.create({ data: { userId, feedId } }),
        ]);
      }
    })
  );
}
