import type { Handler } from '@netlify/functions';
import { cleanupUnlinkedData } from '@pdcstrrss/core';

export const handler: Handler = async () => {
  try {
    const { episodeCount, feedCount } = await cleanupUnlinkedData();
    console.debug(`Successfully cleaned up \n${episodeCount.count} episodes \n${feedCount.count} feeds.`);
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
