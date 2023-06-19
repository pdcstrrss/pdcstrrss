import type { Feed, Episode, EpisodesOfUsers } from '@prisma/client';
import {
  db,
  deleteEpisodesByIds,
  deleteFeedsByIds,
  getEpisodesOfUsersByEpisodeIds,
  getFeedsWithEpisodeIds,
  getFeedsWithIdUrl,
  updateEpisodesOfUsersEpisodeId,
} from '@pdcstrrss/database';
import { normalizeUrl } from '../../url/url.service.js';

export type FeedForMerging = {
  id: Feed['id'];
  url: Feed['url'];
};

// Get all feeds with id and url
// Find feeds with the same normalized urls and group them
// Of each feed, find ids equal episodes and group them in an episodeGroup
// Find the episodeUser of each episode in the episodeGroup and change the relation to the first episodeGroup
// Remove all feeds except the first one, together with their episodes
// There now should not be any unlinked episodes or episodesOfUsers left
// If there are, something went wrong and we should throw an error
export async function findAndMergeFeeds() {
  const feeds = await getFeedsWithIdUrl();
  const feedGroupsToMerge = await getFeedGroupsToMerge(feeds);
  const episodeGroups = await getEpisodeGroupsByFeedGroups(feedGroupsToMerge);

  // Prepare episodesOfUser information to update
  const episodesOfUserUpdateTransactionsData = await getEpisodesOfUserUpdateData(episodeGroups);
  const episodesOfUsersForTransaction = await getEpisodesOfUsersByEpisodeIds(
    episodesOfUserUpdateTransactionsData.map(([episodeId]) => episodeId)
  );
  // const episodesOfUserUpdateTransactions = await Promise.all(
  //   getEpisodesOfUsersUpdateTransactions(episodesOfUsersForTransaction, episodesOfUserUpdateTransactionsData)
  // );

  // Prepare episodes information to deleted
  const episodesOfUserUpdateTransactions = await db.$transaction(
    getEpisodesOfUsersUpdateTransactions(episodesOfUsersForTransaction, episodesOfUserUpdateTransactionsData)
  );

  const episodesToDelete = episodesOfUserUpdateTransactionsData.map(([episodeId]) => episodeId);
  await deleteEpisodesByIds(episodesToDelete);

  // Move users to first feed
  await Promise.all(
    feedGroupsToMerge.map((feedGroup) =>
      db.feedsOfUsers.updateMany({
        where: { feedId: { in: feedGroup.slice(1) } },
        data: { feedId: feedGroup[0] },
      })
    )
  );

  const feedsToDelete = feedGroupsToMerge.map((feedGroup) => feedGroup.slice(1)).flat();
  const feedsDeleted = await deleteFeedsByIds(feedsToDelete);

  // Return results
  return {
    feedsDeleted: feedsDeleted.count,
    feedGroupsFound: feedGroupsToMerge.length,
    episodesUpdated: episodesOfUserUpdateTransactions.length,
    episodesDeleted: episodesToDelete.length,
  };
}

// Find feeds with the same normalized urls and group them
export async function getFeedGroupsToMerge(feeds: FeedForMerging[]) {
  const feedGroups: Feed['id'][][] = [];

  for (const feed of feeds) {
    const feedsWithEqualUrls: FeedForMerging[] = [];
    for (const { id, url } of feeds) {
      if ((await normalizeUrl(feed.url)) === (await normalizeUrl(url)) && id !== feed.id) {
        feedsWithEqualUrls.push({ id, url });
      }
    }

    const feedsToMergeGroup = [feed.id, ...feedsWithEqualUrls.map(({ id }) => id)];

    const groupExists = feedGroups.filter((group) => group.every((id) => feedsToMergeGroup.includes(id)));
    if (!groupExists.length) {
      feedGroups.push(feedsToMergeGroup);
    }
  }

  return feedGroups;
}

export async function getEpisodeGroupsByFeedGroups(feedGroups: Feed['id'][][]) {
  const feedsGroupsWithEpisodeIds = await Promise.all(feedGroups.map(getFeedsWithEpisodeIds));
  return feedsGroupsWithEpisodeIds.map((feedGroup) => feedGroup.map(({ episodes }) => episodes.map(({ id }) => id)));
}

export async function getEpisodesOfUserUpdateData(feedsGroupsWithEpisodeIds: Episode['id'][][][]) {
  const episodesOfUserUpdateTransactionsData: [Episode['id'], Episode['id']][] = [];
  for (const feedGroup of feedsGroupsWithEpisodeIds) {
    feedGroup.forEach((episodeIds) => {
      episodeIds.forEach((episodeId, episodeIdIndex) => {
        const firstEpisodeId = feedGroup[0][episodeIdIndex];
        if (episodeId === firstEpisodeId) return;
        episodesOfUserUpdateTransactionsData.push([episodeId, firstEpisodeId]);
      });
    });
  }
  return episodesOfUserUpdateTransactionsData;
}

export function getEpisodesOfUsersUpdateTransactions(
  episodesOfUsers: EpisodesOfUsers[],
  episodesOfUserUpdateTransactionsData: [Episode['id'], Episode['id']][]
) {
  const acc = [];
  for (const [episodeId, firstEpisodeId] of episodesOfUserUpdateTransactionsData) {
    const { userId } = episodesOfUsers.find(({ episodeId: id }) => id === episodeId) || {};
    if (!userId) {
      console.error('No userId found for episodeId', { episodeId });
      continue;
    }
    acc.push(updateEpisodesOfUsersEpisodeId(userId, episodeId, firstEpisodeId));
  }
  return acc;
}
