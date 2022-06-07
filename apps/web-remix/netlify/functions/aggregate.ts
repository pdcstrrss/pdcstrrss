import { Handler } from '@netlify/functions';
import { aggregateNewEpisodes } from '@pdcstrrss/core';
import { installGlobals } from '@remix-run/node';

installGlobals();

const handler: Handler = async () => {
  try {
    const { episodesCount, feedCount, linkedEpisodesCount } = await aggregateNewEpisodes();
    return {
      statusCode: 200,
      body: `Successfully aggregated ${episodesCount} episodes from ${feedCount} feeds. \nSynced ${linkedEpisodesCount} new episodes.`,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};

export { handler };
