import type { Handler } from '@netlify/functions';
import { aggregateNewEpisodes } from '@pdcstrrss/core';

export const handler: Handler = async () => {
  try {
    console.debug('Aggregating new episodes');
    const { episodesCount, feedCount, linkedEpisodesCount } = await aggregateNewEpisodes();
    console.debug(
      `Successfully aggregated ${episodesCount} episodes from ${feedCount} feeds. \nSynced ${linkedEpisodesCount} new episodes.`
    );
    return {
      statusCode: 204,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
