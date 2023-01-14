import { db } from '@pdcstrrss/database';

const staleFeedWhereClause = {
  OR: [
    {
      users: {
        none: {},
      },
    },
    {
      episodes: {
        none: {},
      },
    },
  ],
};

const staleEpisodesWhereClause = {
  OR: [
    {
      users: {
        none: {},
      },
    },
  ],
};

export async function getCleanupData() {
  const feedsToCleanup = db.feed.findMany({
    select: {
      id: true,
      title: true,
    },
    where: staleFeedWhereClause,
  });

  const episodesToCleanup = db.episode.findMany({
    select: {
      id: true,
      title: true,
      published: true,
    },
    orderBy: {
      published: 'desc',
    },
    where: staleEpisodesWhereClause,
  });

  const [feeds, episodes] = await db.$transaction([feedsToCleanup, episodesToCleanup]);

  return {
    feeds,
    episodes,
  };
}

export async function cleanupUnlinkedData() {
  const [episodeCount, feedCount] = await db.$transaction([
    db.episode.deleteMany({ where: staleEpisodesWhereClause }),
    db.feed.deleteMany({ where: staleFeedWhereClause }),
  ]);
  return { episodeCount, feedCount };
}
