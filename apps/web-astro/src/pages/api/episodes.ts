import isNumeric from 'validator/lib/isNumeric';
import { getUser } from '@astro-auth/core';
import { APIRoute } from 'astro';
import { getEpisodesData } from '@pdcstrrss/core';

export const get: APIRoute = async ({ params, request }) => {
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

    const { id: userId } = getUser({ server: request }) || {};
    if (!userId) throw new Error('User not found');

    const episodesData = await getEpisodesData({ userId, limit, offset });
    return { body: episodesData };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return new Response(error.message || error, { status: 400 });
  }
};
