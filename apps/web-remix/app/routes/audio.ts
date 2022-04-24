import { getAudioSourceFromExternalWebPage } from 'libs/core/src/services/audio.service';
import { LoaderFunction } from 'remix';

export const loader: LoaderFunction = async ({ request }) => {
  const urlParam = new URL(request.url).searchParams.get('url');
  if (urlParam) {
    if (urlParam.includes('.mp3')) {
      return urlParam;
    }
    const source = await getAudioSourceFromExternalWebPage(urlParam);
    if (source) {
      return source;
    }
  }

  return new Response(null, {
    status: 404,
  });
};
