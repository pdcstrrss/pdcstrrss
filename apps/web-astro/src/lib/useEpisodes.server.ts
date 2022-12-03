import { getUser } from '@astro-auth/core';
import { getEpisodesData } from '@pdcstrrss/core';
import type { AstroGlobal } from 'astro';
import isNumeric from 'validator/lib/isNumeric';
import { getUserFromRequest } from './useUser';

export const getEpisodes = async (astro: Readonly<AstroGlobal<Record<string, any>>>) => {
  try {
    const url = new URL(astro.request.url);
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

    const user = await getUserFromRequest({ request: astro.request });
    if (!user?.id) throw new Response('User not found', { status: 401 });

    const episodesData = await getEpisodesData({ userId: user.id, limit, offset });
    return episodesData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.error(error);
    // return new Response(error.message || error, { status: 400 });
  }
};
