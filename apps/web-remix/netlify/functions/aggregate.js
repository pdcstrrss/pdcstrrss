const { aggregateNewEpisodes } = require('@pdcstrrss/core');
const { installGlobals } = require('@remix-run/node');

installGlobals();

const handler = async () => {
  try {
    const { episodesCount, feedCount, linkedEpisodesCount } = await aggregateNewEpisodes();
    return {
      statusCode: 200,
      body: `Successfully aggregated ${episodesCount} episodes from ${feedCount} feeds. \nSynced ${linkedEpisodesCount} new episodes.`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};

module.exports.handler = handler;
