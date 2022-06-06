import { LoaderFunction } from '@remix-run/server-runtime';
import {
  getEpisodesFromFeedIdsWithEntries,
  getFeedsFromRss,
  getFeedUrls,
  getFullConfig,
  IFeedIdsWithEntries,
  linkUnlinkedEpisodes,
  saveEpisodes,
} from '../../services/core.server';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const feedIdNUrls = await getFeedUrls();
    const fullConfig = getFullConfig({ feeds: feedIdNUrls.map(({ url }) => ({ url })) });
    const feedsData = await getFeedsFromRss(fullConfig);
    const feedIdsWithEntries = feedsData.reduce((acc, feedData) => {
      const feedIdNUrl = feedIdNUrls.find(({ url }) => url === feedData.url);
      if (!feedIdNUrl) return acc;
      return [...acc, { feedId: feedIdNUrl.id, entries: feedData.entries, keyMapping: feedData.keyMapping }];
    }, [] as IFeedIdsWithEntries[]);
    const episodesFromFeeds = await getEpisodesFromFeedIdsWithEntries(feedIdsWithEntries);
    await saveEpisodes(episodesFromFeeds);
    const linkedEpisodesCount = await linkUnlinkedEpisodes();

    return new Response(
      `Successfully aggregated ${episodesFromFeeds.length} episodes from ${feedIdNUrls.length} feeds. \nSynced ${linkedEpisodesCount} new episodes.`,
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    throw new Response(JSON.stringify(error, null, 2), { status: 500 });
  }
};
