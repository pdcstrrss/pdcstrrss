import { LoaderFunction } from '@remix-run/server-runtime';
import isNumeric from 'validator/lib/isNumeric';
import { getEpisodesData, IEpisodesData } from '@pdcstrrss/core';
import { authenticator } from '../../services/auth.server';

export interface IGetEpisodesApiResponse {
  episodesData: IEpisodesData;
}

export const loader: LoaderFunction = async ({ request }): Promise<IGetEpisodesApiResponse | Response> => {
  try {
    const url = new URL(request.url);
    let limit: number | undefined;
    let offset: number | undefined;
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');

    if (limitParam) {
      limit = isNumeric(limitParam) ? Number(limitParam) : undefined;
    }

    if (offsetParam) {
      offset = isNumeric(offsetParam) ? Number(offsetParam) : undefined;
    }

    const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId) throw new Error('User not found');

    const episodesData = await getEpisodesData({ userId, limit, offset });
    return { episodesData };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return new Response(error.message || error, { status: 400 });
  }
};
