import { getEpisodes, getUserById } from '../services/core.server';
import { User } from '@pdcstrrss/database';
import { AuthenticatedLayout } from '@pdcstrrss/ui';
import { Outlet, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import validator from 'validator';
import { authenticator } from '../services/auth.server';

interface EpisodesLoaderResponse {
  user: User;
  audioSource?: string;
}

export type AuthenticatedLayoutContextType = {
  user: User;
};

async function getAudioSource({ request }: { request: Request }) {
  const { origin, searchParams } = new URL(request.url);
  const urlParam = searchParams.get('episode');
  if (urlParam) {
    const fetchUrl = new URL(origin + '/audio');
    fetchUrl.searchParams.set('episode', urlParam);
    const audioSource: string = await fetch(fetchUrl.toString(), { headers: request.headers }).then((res) =>
      res.json()
    );
    return audioSource;
  }
  return;
}

export const loader: LoaderFunction = async ({ request }): Promise<EpisodesLoaderResponse | Response> => {
  try {
    const { id: userId, accessToken } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId || !accessToken) throw new Response('User not authenticated', { status: 401 });
    const user = await getUserById(userId);
    if (!user) throw new Response('User not found', { status: 400 });
    const audioSource = await getAudioSource({ request });
    return { user, audioSource };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function Episodes() {
  const { user, audioSource } = useLoaderData<EpisodesLoaderResponse>();
  return (
    <AuthenticatedLayout user={user} audioSource={audioSource}>
      <Outlet />
    </AuthenticatedLayout>
  );
}
