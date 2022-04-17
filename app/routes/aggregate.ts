import { LoaderFunction } from "remix";
import isNumeric from "validator/lib/isNumeric";
import aggregator from "~/lib/aggregator";
import type { EpisodesData, Feed } from "~/lib/types";

export interface AggregateResponse {
  episodes: EpisodesData;
  feeds: Feed[];
}
export const loader: LoaderFunction = async ({ request }): Promise<AggregateResponse> => {
  const url = new URL(request.url);
  let limit: number | undefined;
  let offset: number | undefined;
  const limitParam = url.searchParams.get("limit");
  const offsetParam = url.searchParams.get("offset");

  if (limitParam) {
    limit = isNumeric(limitParam) ? Number(limitParam) : undefined;
  }

  if (offsetParam) {
    offset = isNumeric(offsetParam) ? Number(offsetParam) : undefined;
  }

  const { episodes, feeds } = await aggregator({ limit, offset });
  return { episodes, feeds };
};
