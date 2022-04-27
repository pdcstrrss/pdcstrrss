import { User } from '@pdcstrrss/database';
import { EpisodesIndexView } from '@pdcstrrss/ui';
import { Outlet, useLoaderData } from '@remix-run/react';
import { LoaderFunction, redirect } from '@remix-run/server-runtime';
import isURL from 'validator/lib/isURL';
import { authenticator } from '../services/auth.server';
import { initializeUserByRequest } from '../services/user.server';

interface EpisodesLoaderResponse {
  user: User;
  audioSource?: string;
}

async function getAudioSource({ request }: { request: Request }) {
  const url = new URL(request.url);
  let urlParam = url.searchParams.get('episode');
  urlParam = isURL(urlParam || '') ? urlParam : null;
  if (urlParam) {
    const fetchUrl = new URL(url.origin + '/audio');
    fetchUrl.searchParams.set('url', urlParam);
    const audioSource: string = await fetch(fetchUrl.toString()).then((res) => res.json());
    return audioSource;
  }
  return;
}

export const loader: LoaderFunction = async ({ request }): Promise<EpisodesLoaderResponse | Response> => {
  try {
    const getAuthenticationCookie = authenticator.isAuthenticated(request);
    const { user, userSponsorship } = (await initializeUserByRequest({ getAuthenticationCookie })) || {};

    if (!user) {
      return redirect('/');
    }

    if (!userSponsorship?.sponsor && !userSponsorship?.contributor) {
      return redirect('/pricing');
    }

    const audioSource = await getAudioSource({ request });

    return { user, audioSource };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function Episodes() {
  const { user, audioSource } = useLoaderData<EpisodesLoaderResponse>();
  return (
    <EpisodesIndexView user={user} audioSource={audioSource}>
      <Outlet />
    </EpisodesIndexView>
  );
}
