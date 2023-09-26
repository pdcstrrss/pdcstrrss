import { Episode, EpisodeStatus, User } from '@prisma/client';
import { db } from '@pdcstrrss/database';
import { defaultsDeep } from 'lodash';
import type { IRepositoryFilters, IRequiredRepositoryFilters } from '../types.js';

export type IEpisode = Pick<Episode, 'id' | 'title' | 'url' | 'published' | 'image'> & {
  feed: {
    title: string;
    description: string | null;
    link: string | null;
  };
};

export type IEpisodeOfUser = IEpisode & {
  status?: EpisodeStatus;
};

export interface IGetEpisodeParams {
  id: string;
  userId?: string;
}

export type IGetEpisodesParams = Partial<IGetEpisodeParams> & IRepositoryFilters;

export interface IEpisodesData extends Omit<IRequiredRepositoryFilters<IGetEpisodesParams>, 'orderBy'> {
  episodes: IEpisodeOfUser[];
  totalCount: number;
  limit: number;
  offset: number;
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
        link: true,
      },
    },
  },
};

const DEFAULT_EPISODE_OF_USER_QUERY = {
  select: {
    ...DEFAULT_EPISODE_QUERY.select,
    users: {
      select: {
        status: true,
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

export async function getEpisodeById({ id, userId }: IGetEpisodeParams): Promise<IEpisodeOfUser | null> {
  const episode = await db.episode.findUnique({
    ...DEFAULT_EPISODE_OF_USER_QUERY,
    where: {
      id,
      ...(userId && { users: { some: { userId } } }),
    },
  });

  if (!episode) return null;

  return {
    ...episode,
    status: episode?.users[0]?.status,
  };
}

export async function getEpisodes(params?: IGetEpisodesParams): Promise<IEpisodeOfUser[]> {
  const { userId, offset, limit, orderBy } = defaultsDeep(
    params,
    DEFAULT_GET_EPISODE_PARAMS
  ) as IRequiredRepositoryFilters<IGetEpisodesParams>;

  const episodes = await db.episode.findMany({
    ...(userId && { where: { users: { some: { userId } } } }),
    orderBy,
    take: limit,
    skip: offset,
    ...DEFAULT_EPISODE_OF_USER_QUERY,
  });

  return episodes.map((episode) => ({
    ...episode,
    status: episode?.users[0]?.status,
  }));
}

export async function getEpisodeWithStatusPlaying(userId?: string) {
  if (!userId) return null;
  return db.episode.findFirst({
    where: { users: { some: { userId, status: EpisodeStatus.PLAYING } } },
  });
}

export function getTotalEpisodeCount(userId?: string) {
  if (!userId) return 0;
  return db.episodesOfUsers.count({ where: { userId } });
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

async function updateEpisodeStatusToPlay(episodeId: Episode['id'], userId: User['id'], status: EpisodeStatus) {
  await db.episodesOfUsers.updateMany({
    where: { status: EpisodeStatus.PLAYING, userId },
    data: { status: EpisodeStatus.PAUSED },
  });

  await db.episodesOfUsers.update({
    where: { userId_episodeId: { userId, episodeId } },
    data: { status },
  });
}

export async function updateEpisodeStatus(episodeId: Episode['id'], userId: User['id'], status: EpisodeStatus) {
  switch (status) {
    case EpisodeStatus.PLAYING:
      await updateEpisodeStatusToPlay(episodeId, userId, status);
      break;
    default:
      await db.episodesOfUsers.update({
        where: { userId_episodeId: { userId, episodeId } },
        data: { status },
      });
  }
}
