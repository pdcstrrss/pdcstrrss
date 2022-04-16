import { useLoaderData, useNavigate } from "remix";
import { useState } from "react";
import type { LoaderFunction } from "remix";
import { AggregateResponse } from "./aggregate";
import { AppHeader } from "~/components/app/AppHeader/AppHeader";
import { EpisodeList, links as episodeListLinks } from "~/components/episode/EpisodeList/EpisodeList";
import { Pagination, links as paginationLinks } from "~/components/Pagination/Pagination";

async function getAggregateData(url: string) {
  const _url = new URL(url);
  _url.pathname = "/aggregate";
  return fetch(_url.toString()).then((res) => res.json());
}

export function links() {
  return [...episodeListLinks(), ...paginationLinks(), { rel: "stylesheet" }];
}

export const loader: LoaderFunction = async ({ request }): Promise<AggregateResponse> => {
  const data = await getAggregateData(request.url);
  return data;
};

export default function Index() {
  const loaderData = useLoaderData<AggregateResponse>();
  let navigate = useNavigate();
  let [episodesData, setEpisodesData] = useState<AggregateResponse["episodes"]>(loaderData.episodes);
  let [pageSize, setPageSize] = useState<number>(loaderData.episodes.limit - loaderData.episodes.offset);
  let [currentPage, setCurrentPage] = useState<number>(loaderData.episodes.offset / pageSize + 1);

  // console.log(episodesData)

  const getOffset = (page: number) => (page - 1) * pageSize;
  const getLimit = (page: number) => (page - 1) * pageSize + pageSize;
  const updateAggregateData = async (url: string) => {
    const data = await getAggregateData(url);
    setEpisodesData(data.episodes);
    setPageSize(data.episodes.limit - data.episodes.offset);
    setCurrentPage(data.episodes.offset / pageSize + 1);
  };
  const handlePaginationChange = (page: number) => {
    const url = new URL(document?.location.href);
    url.searchParams.set("offset", `${getOffset(page)}`);
    url.searchParams.set("limit", `${getLimit(page)}`);
    navigate(url.toString().replace(url.origin, ""));
    updateAggregateData(url.toString()).catch(console.error);
  };

  const itemRender = (
    page: number,
    type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    element: React.ReactNode
  ) => {
    if (
      (type === "prev" && episodesData.offset === 0) ||
      (type === "next" && episodesData.offset + pageSize > episodesData.totalCount)
    ) {
      return;
    }
    return element;
  };

  return (
    <div data-page-index>
      <AppHeader />
      <EpisodeList episodes={episodesData.data} />
      <Pagination
        simple
        onChange={handlePaginationChange}
        current={currentPage}
        total={episodesData.totalCount}
        pageSize={pageSize}
        itemRender={itemRender}
      />
    </div>
  );
}
