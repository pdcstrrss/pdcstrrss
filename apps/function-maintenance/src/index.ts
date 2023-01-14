import type { Handler } from '@netlify/functions';
import { cleanupUnlinkedData } from '@pdcstrrss/core';

const handler: Handler = async () => {
  try {
    const { episodeCount, feedCount } = await cleanupUnlinkedData();
    console.debug(`Successfully cleaned up \n${episodeCount} episodes \n${feedCount} feeds.`);
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

module.exports.handler = handler;
