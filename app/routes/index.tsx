import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import aggregator from "~/lib/aggregator";
import { AppHeader } from "~/components/app/AppHeader/AppHeader";
import { EpisodeList, links as episodeListLinks } from "~/components/episode/EpisodeList/EpisodeList";
import type { Feed, Episode } from "~/lib/types";

interface IndexLoaderData {
  episodes: Episode[];
  feeds: Feed[];
}

export function links() {
  return [...episodeListLinks(), { rel: "stylesheet" }];
}

export const loader: LoaderFunction = async (): Promise<IndexLoaderData> => {
  const { episodes, feeds } = await aggregator();
  return { episodes, feeds };
};

export default function Index() {
  const { episodes } = useLoaderData<IndexLoaderData>();
  return (
    <div data-page-index>
      <AppHeader />
      <EpisodeList episodes={episodes} />
    </div>
  );
}
