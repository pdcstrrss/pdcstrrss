/* eslint-disable @typescript-eslint/ban-ts-comment */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
// import { promisify } from 'node:util';
// import { exec as execSync } from 'node:child_process';
import { db } from '@pdcstrrss/database';
import { createFeedByForUser } from './feed.service';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

function getFixturePath(name: string) {
  return resolve(__dirname, `../../test/fixtures/${name}`);
}

describe.only('Feed', () => {
  it('can create feed for user', async () => {
    async function cleanup() {
      await db.$transaction([
        db.episodesOfUsers.deleteMany(),
        db.feedsOfUsers.deleteMany(),
        db.user.deleteMany(),
        db.feed.deleteMany(),
        db.episode.deleteMany(),
      ]);
    }

    await cleanup();

    // Mock feeds to ingest
    const feedsToIngest = [
      {
        url: 'https://shoptalkshow.be/feed.xml',
        xml: readFile(getFixturePath('shoptalk.rss'), 'utf8'),
      },
      {
        url: 'https://nerdland.be/feed.xml',
        xml: readFile(getFixturePath('nerdland.rss'), 'utf8'),
      },
      {
        url: 'https://syntax.fm/feed.xml',
        xml: readFile(getFixturePath('syntax.rss'), 'utf8'),
      },
    ];

    // Mock fetch
    // @ts-ignore
    global.fetch = jest.fn((url) => {
      const feed = feedsToIngest.find((feed) => feed.url === url);
      return Promise.resolve({
        text: () => feed?.xml,
      });
    });

    try {
      const user = await db.user.create({
        data: {
          email: 'abc@def.com',
          githubId: 'abc',
        },
      });

      // Run createFeedByForUser for each feed to ingest
      await Promise.all(feedsToIngest.map(async (feed) => createFeedByForUser({ userId: user.id, url: feed.url })));

      // Get all feeds from database
      const receivedFeeds = await db.feed.findMany({
        select: {
          title: true,
          url: true,
          generator: true,
          language: true,
          episodes: {
            select: {
              title: true,
              published: true,
              url: true,
              users: {
                select: {
                  user: {
                    select: {
                      email: true,
                      githubId: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              published: 'desc',
            },
          },
          users: {
            select: {
              user: {
                select: {
                  email: true,
                  githubId: true,
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

      console.log(JSON.stringify(receivedFeeds, null, 2));

      // Match received feeds against snapshot
      expect(receivedFeeds).toMatchSnapshot();
    } catch (error) {
      expect(error).toBeUndefined();
      console.error(error);
    }

    // Cleanup
    await cleanup();
  });

  // it('can aggregate new episodes', () => {});
});
