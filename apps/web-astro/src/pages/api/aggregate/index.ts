import type { Feed } from '@prisma/client';
import { aggregateNewEpisodes } from '@pdcstrrss/core';
import type { APIRoute } from 'astro';

export const get: APIRoute = async ({ request }) => {
  try {
    const secret = new URL(request.url).searchParams.get('secret');

    if (secret !== import.meta.env.AGGREGATOR_SECRET)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const idParam = new URL(request.url).searchParams.get('id');

    let feedIds: Feed['id'][] | undefined = undefined;
    if (Array.isArray(idParam)) {
      feedIds = idParam;
    } else if (idParam) {
      feedIds = [idParam];
    }

    const result = await aggregateNewEpisodes({ feedIds });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
};
