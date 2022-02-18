import isNumeric from "validator/lib/isNumeric";
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import type { EpisodesData } from "~/lib/aggregator";
import aggregator from "~/lib/aggregator";
import { AppHeader } from "~/components/app/AppHeader/AppHeader";
import { EpisodeList, links as episodeListLinks } from "~/components/episode/EpisodeList/EpisodeList";
import type { Feed } from "~/lib/types";
import { Pagination, links as paginationLinks } from "~/components/Pagination/Pagination";
import { BASE_URL } from "~/lib/constants";

interface IndexLoaderData {
  episodes: EpisodesData;
  feeds: Feed[];
}

export function links() {
  return [...episodeListLinks(), ...paginationLinks(), { rel: "stylesheet" }];
}

export const loader: LoaderFunction = async ({ request }): Promise<IndexLoaderData> => {
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

export default function Index() {
  const {
    episodes: { data, totalCount, limit, offset },
  } = useLoaderData<IndexLoaderData>();

  const pageSize = limit - offset;
  const currentPage = offset / pageSize + 1;

  const getOffset = (page: number) => (page - 1) * pageSize;
  const getLimit = (page: number) => (page - 1) * pageSize + pageSize;

  const handlePaginationChange = (page: number) => {
    const url = new URL(document?.location.href);
    url.searchParams.set("offset", `${getOffset(page)}`);
    url.searchParams.set("limit", `${getLimit(page)}`);
    window.location.href = url.toString().replace(BASE_URL, "");
  };

  const itemRender = (
    page: number,
    type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    element: React.ReactNode
  ) => {
    if ((type === "prev" && offset === 0) || (type === "next" && offset + pageSize > totalCount)) {
      return;
    }
    return element;
  };

  return (
    <div data-page-index>
      <AppHeader />
      <EpisodeList episodes={data} />
      <Pagination
        simple
        onChange={handlePaginationChange}
        current={currentPage}
        total={totalCount}
        pageSize={pageSize}
        itemRender={itemRender}
      />
    </div>
  );
}
