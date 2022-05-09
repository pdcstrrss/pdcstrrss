import { getAudioSourceFromExternalWebPage, getEpisodeById } from '../services/core.server';
import { LoaderFunction } from '@remix-run/server-runtime';
import { authenticator } from '../services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const { id: userId, accessToken } = (await authenticator.isAuthenticated(request)) || {};
  if (!userId || !accessToken) throw new Response('User not authenticated', { status: 401 });

  const episodeId = new URL(request.url).searchParams.get('episode');
  if (!episodeId) throw new Response('Episode not specified', { status: 400 });
  const episode = await getEpisodeById({ id: episodeId });
  if (!episode) throw new Response('Episode not found', { status: 404 });
  if (episode.url) {
    if (episode.url.includes('.mp3')) {
      return episode.url;
    }
    const source = await getAudioSourceFromExternalWebPage(episode.url);
    if (source) {
      return source;
    }
  }
  throw new Response('Episode audio not found', {
    status: 404,
  });
};
