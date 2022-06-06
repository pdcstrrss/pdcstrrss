import { getUserById } from '../../services/core.server';
import { AuthenticatedLayout } from '@pdcstrrss/ui';
import { Outlet, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { authenticator } from '../../services/auth.server';

interface EpisodesLoaderResponse {
  audioSource?: string;
}

async function getAudioSource({ request }: { request: Request }) {
  const { origin, searchParams } = new URL(request.url);
  const urlParam = searchParams.get('episode');
  if (urlParam) {
    const fetchUrl = new URL(origin + '/api/audio');
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
    const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId ) throw new Response('User not authenticated', { status: 401 });
    const user = await getUserById(userId);
    if (!user) throw new Response('User not found', { status: 400 });
    const audioSource = await getAudioSource({ request });
    return { audioSource };

  } catch (error: any) {
    throw new Error(error);
  }
};

export default function Episodes() {
  const { audioSource } = useLoaderData<EpisodesLoaderResponse>();
  return (
    <AuthenticatedLayout audioSource={audioSource}>
      <Outlet />
    </AuthenticatedLayout>
  );
}
