import { Feed, Episode } from '@prisma/client';
import {
  FeedForMerging,
  getEpisodeGroupsByFeedGroups,
  getEpisodesOfUserUpdateData,
  getFeedGroupsToMerge,
} from './feedMerger.service';

jest.mock('@pdcstrrss/database', () => {
  const originalModule = jest.requireActual('@pdcstrrss/database');
  const mockedFeedsWithEpisodeIds = (feedIds: Feed['id'][]): { id: Feed['id']; episodes: { id: string }[] }[] =>
    feedIds.map((id) => ({ id, episodes: Array.from({ length: 3 }, (_, i) => ({ id: `${id}-${i}` })) }));

  return {
    __esModule: true,
    ...originalModule,
    getFeedsWithEpisodeIds: jest.fn(mockedFeedsWithEpisodeIds),
  };
});

test('can get FeedGroups with feeds with equal normalized URLs', async () => {
  const feeds: FeedForMerging[] = [
    {
      id: '1',
      url: 'https://example.com/feed1',
    },
    {
      id: '2',
      url: 'https://example.com/feed2',
    },
    {
      id: '3',
      url: 'https://example.com/feed1/',
    },
    {
      id: '4',
      url: 'https://example.com/feed2/',
    },
    {
      id: '5',
      url: 'https://example.com/feed2',
    },
  ];

  const expectedFeedGroups: Feed['id'][][] = [
    ['1', '3'],
    ['2', '4', '5'],
  ];

  const feedGroups = await getFeedGroupsToMerge(feeds);
  expect(feedGroups).toStrictEqual(expectedFeedGroups);
});

test('can getEpisodeGroupsByFeedGroups', async () => {
  const feeds: Feed['id'][][] = [
    ['1', '3'],
    ['2', '4', '5'],
  ];

  const exceptedEpisodeGroups = [
    [
      ['1-0', '1-1', '1-2'],
      ['3-0', '3-1', '3-2'],
    ],
    [
      ['2-0', '2-1', '2-2'],
      ['4-0', '4-1', '4-2'],
      ['5-0', '5-1', '5-2'],
    ],
  ];

  const episodeGroups = await getEpisodeGroupsByFeedGroups(feeds);
  expect(episodeGroups).toStrictEqual(exceptedEpisodeGroups);
});

test('can getEpisodesOfUserUpdateData', async () => {
  const feedsGroupsWithEpisodeIds = [
    [
      ['1-0', '1-1', '1-2'],
      ['3-0', '3-1', '3-2'],
    ],
    [
      ['2-0', '2-1', '2-2'],
      ['4-0', '4-1', '4-2'],
      ['5-0', '5-1', '5-2'],
    ],
  ];

  const expectedEpisodesOfUserUpdateTransactionsData = [
    ['3-0', '1-0'],
    ['3-1', '1-1'],
    ['3-2', '1-2'],
    ['4-0', '2-0'],
    ['4-1', '2-1'],
    ['4-2', '2-2'],
    ['5-0', '2-0'],
    ['5-1', '2-1'],
    ['5-2', '2-2'],
  ];

  const episodesOfUserUpdateTransactionsData = await getEpisodesOfUserUpdateData(feedsGroupsWithEpisodeIds);
  expect(episodesOfUserUpdateTransactionsData).toStrictEqual(expectedEpisodesOfUserUpdateTransactionsData);
});
