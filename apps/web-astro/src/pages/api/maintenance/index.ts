import { cleanupUnlinkedData, findAndMergeFeeds } from '@pdcstrrss/core';
import type { APIRoute } from 'astro';

export const get: APIRoute = async ({ request }) => {
  try {
    const secret = new URL(request.url).searchParams.get('secret');

    if (secret !== import.meta.env.AGGREGATOR_SECRET)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { feedGroupsFound, episodesUpdated, episodesDeleted } = await findAndMergeFeeds();

    const { episodeCount, feedCount } = await cleanupUnlinkedData();

    const message = `
      [Feed Merger]
        Found ${feedGroupsFound} feed groups to merge
        Updated ${episodesUpdated} episodes
        Deleted ${episodesDeleted} episodes
      [Clean up linked data]
        Successfully cleaned up \n${episodeCount.count} episodes \n${feedCount.count} feeds.
    `;

    const result = {
      cleanupResult: {
        episodeCount,
        feedCount,
      },
      feedMergerResult: {
        feedGroupsFound,
        episodesUpdated,
        episodesDeleted,
      },
    };

    console.log(message);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
};
