import { db, Episode } from '@pdcstrrss/database';
import defaultsDeep from 'lodash/defaultsDeep';
import { IRepositoryFilters, IRequiredRepositoryFilters } from '..';

export type IEpisode = Pick<Episode, 'id' | 'title' | 'url' | 'published' | 'image'> & {
  feed: {
    title: string;
    description: string | null;
  };
};

export interface IGetEpisodeParams {
  id: string;
  userId?: string;
}

export type IGetEpisodesParams = Partial<IGetEpisodeParams> & IRepositoryFilters;

export interface IEpisodesData extends Omit<IRequiredRepositoryFilters<IGetEpisodesParams>, 'orderBy'> {
  episodes: IEpisode[];
  totalCount: number;
}

const DEFAULT_EPISODE_QUERY = {
  select: {
    id: true,
    title: true,
    url: true,
    published: true,
    image: true,
    feed: {
      select: {
        title: true,
        description: true,
      },
    },
  },
};

const DEFAULT_GET_EPISODE_PARAMS = {
  offset: 0,
  limit: 10,
  orderBy: {
    published: 'desc',
  },
};

export function getAllEpisodes(): Promise<IEpisode[]> {
  return db.episode.findMany({
    ...DEFAULT_EPISODE_QUERY,
  });
}

export async function getEpisodeById({ id, userId }: IGetEpisodeParams): Promise<IEpisode | null> {
  return db.episode.findUnique({
    ...DEFAULT_EPISODE_QUERY,
    where: {
      id,
      ...(userId && { users: { some: { userId } } }),
    },
  });
}

export async function getEpisodes(params?: IGetEpisodesParams): Promise<IEpisode[]> {
  const { userId, offset, limit, orderBy } = defaultsDeep(
    params,
    DEFAULT_GET_EPISODE_PARAMS
  ) as IRequiredRepositoryFilters<IGetEpisodesParams>;

  return db.episode.findMany({
    ...(userId && { where: { users: { some: { userId } } } }),
    orderBy,
    take: limit,
    skip: offset,
    ...DEFAULT_EPISODE_QUERY,
  });
}

export function getTotalEpisodeCount(userId?: string) {
  return db.episode.count({
    ...(userId && { where: { users: { every: { userId } } } }),
  });
}

export async function getEpisodesData(params?: IGetEpisodesParams): Promise<IEpisodesData> {
  const { userId, offset, limit, orderBy } = defaultsDeep(params, DEFAULT_GET_EPISODE_PARAMS);
  const episodes = await getEpisodes({ userId, offset, limit, orderBy });
  const totalCount = await getTotalEpisodeCount(userId);
  return { episodes, totalCount, limit, offset };
}

export async function linkUnlinkedEpisodes() {
  const unlinkedEpisodes = await db.episode.findMany({
    where: { users: { none: {} } },
    select: { id: true, feedId: true },
  });

  const feedIdsToUpdate = unlinkedEpisodes.reduce((acc, { feedId }) => {
    if (acc.includes(feedId)) return acc;
    return [...acc, feedId];
  }, [] as string[]);

  const feedsOfUsersToUpdate = await db.feedsOfUsers.findMany({
    where: { feedId: { in: feedIdsToUpdate } },
    select: { userId: true, feedId: true },
  });

  const updatedFeedsOfUsers = await Promise.all(
    feedsOfUsersToUpdate.map(async ({ feedId, userId }) =>
      db.episodesOfUsers.createMany({
        data: unlinkedEpisodes
          .filter(({ feedId: episodeFeedId }) => episodeFeedId === feedId)
          .map(({ id }) => ({
            userId,
            episodeId: id,
          })),
      })
    )
  );

  return updatedFeedsOfUsers.reduce((acc, { count }) => acc + count, 0);
}
