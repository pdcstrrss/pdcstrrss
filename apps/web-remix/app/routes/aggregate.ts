import { LoaderFunction } from '@remix-run/server-runtime';
import isNumeric from 'validator/lib/isNumeric';
import type { IEpisodesData } from '@pdcstrrss/core';
import { aggregateEpisodesAndFeeds } from '@pdcstrrss/core';

export interface AggregateResponse {
  episodesData: IEpisodesData;
}

export const loader: LoaderFunction = async ({ request }): Promise<AggregateResponse> => {
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

  const { episodesData } = await aggregateEpisodesAndFeeds({ limit, offset });
  return { episodesData };
};
