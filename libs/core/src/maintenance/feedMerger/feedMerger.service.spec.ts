import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { db } from '@pdcstrrss/database';
import { findAndMergeFeeds } from './feedMerger.service.js';

async function cleanUpDatabase() {
  const deleteAllEpisodesOfUsers = db.episodesOfUsers.deleteMany();
  const deleteAllFeeds = db.feed.deleteMany();
  const deleteAllUsers = db.user.deleteMany();
  const deleteAllEpisodes = db.episode.deleteMany();
  await db.$transaction([deleteAllEpisodesOfUsers, deleteAllFeeds, deleteAllUsers, deleteAllEpisodes]);
}

async function setupDatabase() {
  const users = await db.$transaction(
    [
      {
        email: 'email 1',
        githubId: 'githubId 1',
      },
      {
        email: 'email 2',
        githubId: 'githubId 2',
      },
    ].map((data) =>
      db.user.create({
        data,
      })
    )
  );

  const feeds = await db.$transaction(
    [
      {
        id: 'feedid 1',
        url: 'https://www.pdcstsrss.app/feed',
        title: 'PDCSTR RSS 1',
      },
      {
        id: 'feedid 2',
        url: 'https://www.pdcstsrss.app/feed/',
        title: 'PDCSTR RSS 2',
      },
    ].map((data, index) =>
      db.feed.create({
        data: {
          ...data,
          users: {
            connectOrCreate: {
              where: {
                userId_feedId: {
                  userId: users[index].id,
                  feedId: data.id,
                },
              },
              create: {
                userId: users[index].id,
              },
            },
          },
        },
      })
    )
  );

  const episodesToCreate = feeds
    .map((feed, index) => [
      {
        title: 'Episode 1',
        description: 'Episode 1 description',
        url: feed.url + /episode-1/,
        published: new Date(),
        feedId: feed.id,
        userId: users[index].id,
      },
      {
        title: 'Episode 2',
        description: 'Episode 2 description',
        url: feed.url + /episode-2/,
        published: new Date(),
        feedId: feed.id,
        userId: users[index].id,
      },
      {
        title: 'Episode 3',
        description: 'Episode 3 description',
        url: feed.url + /episode-3/,
        published: new Date(),
        feedId: feed.id,
        userId: users[index].id,
      },
    ])
    .flat();

  const episodes = await db.$transaction(
    episodesToCreate.map(({ feedId, userId, ...data }) =>
      db.episode.create({
        data: { ...data, feed: { connect: { id: feedId } } },
      })
    )
  );

  const linkedEpisodes = await db.$transaction(
    episodes.map((episode, index) =>
      db.episodesOfUsers.create({
        data: {
          episodeId: episode.id,
          userId: episodesToCreate[index].userId,
        },
      })
    )
  );
}

describe('FeedMergerService integration', () => {
  beforeEach(async () => {
    await cleanUpDatabase();
    await setupDatabase();
  });

  afterEach(async () => {
    await cleanUpDatabase();
  });

  it('should findAndMergeFeeds', async () => {
    const results = await findAndMergeFeeds();
    expect(results).toEqual({
      feedGroupsFound: 1,
      episodesUpdated: 3,
      episodesDeleted: 3,
      feedsDeleted: 1,
    });

    const receivedFeeds = await db.feed.findMany({
      select: {
        title: true,
        url: true,
        episodes: {
          select: {
            title: true,
          },
          orderBy: {
            title: 'asc',
          },
        },
        users: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    const expectedFeeds: typeof receivedFeeds = [
      {
        title: 'PDCSTR RSS 1',
        url: 'https://www.pdcstsrss.app/feed',
        episodes: [
          {
            title: 'Episode 1',
          },
          {
            title: 'Episode 2',
          },
          {
            title: 'Episode 3',
          },
        ],
        users: [
          {
            user: {
              email: 'email 1',
            },
          },
          {
            user: {
              email: 'email 2',
            },
          },
        ],
      },
    ];

    expect(receivedFeeds).toStrictEqual(expectedFeeds);

    const receivedEpisodes = await db.episode.findMany({
      select: {
        title: true,
        feed: {
          select: {
            title: true,
          },
        },
        users: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
          orderBy: {
            user: {
              email: 'asc',
            },
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    const expectedEpisodes: typeof receivedEpisodes = [
      {
        title: 'Episode 1',
        feed: {
          title: 'PDCSTR RSS 1',
        },
        users: [
          {
            user: {
              email: 'email 1',
            },
          },
          {
            user: {
              email: 'email 2',
            },
          },
        ],
      },
      {
        title: 'Episode 2',
        feed: {
          title: 'PDCSTR RSS 1',
        },
        users: [
          {
            user: {
              email: 'email 1',
            },
          },
          {
            user: {
              email: 'email 2',
            },
          },
        ],
      },
      {
        title: 'Episode 3',
        feed: {
          title: 'PDCSTR RSS 1',
        },
        users: [
          {
            user: {
              email: 'email 1',
            },
          },
          {
            user: {
              email: 'email 2',
            },
          },
        ],
      },
    ];

    expect(receivedEpisodes).toStrictEqual(expectedEpisodes);
  });
});
