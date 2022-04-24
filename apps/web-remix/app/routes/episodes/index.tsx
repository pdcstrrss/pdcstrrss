import { IEpisodesData } from "@pdcstrrss/core";
import { EpisodeList, EpisodeListLinks, PaginationLinks } from "@pdcstrrss/ui";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import Pagination from "rc-pagination";
import { useState } from "react";
import { AggregateResponse } from "../aggregate";

async function getAggregateData(url: string): Promise<AggregateResponse> {
  const _url = new URL(url);
  _url.pathname = "/aggregate";
  return fetch(_url.toString()).then((res) => res.json());
}

interface EpisodesIndexLoaderResponse {
  episodesData: IEpisodesData;
}

export function links() {
  return [...EpisodeListLinks(), ...PaginationLinks()];
}

export const loader: LoaderFunction = async ({ request }): Promise<EpisodesIndexLoaderResponse> => {
  try {
    const { episodesData } = await getAggregateData(request.url);
    return { episodesData };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function Episodes() {
  const { episodesData: data } = useLoaderData<EpisodesIndexLoaderResponse>();
  let navigate = useNavigate();
  let [episodesData, setEpisodesData] = useState<IEpisodesData>(data);
  let [pageSize, setPageSize] = useState<number>(data.limit - data.offset);
  let [currentPage, setCurrentPage] = useState<number>(data.offset / pageSize + 1);

  const getOffset = (page: number) => (page - 1) * pageSize;
  const getLimit = (page: number) => (page - 1) * pageSize + pageSize;
  const updateAggregateData = async (url: string) => {
    const data = await getAggregateData(url);
    setEpisodesData(data.episodesData);
    setPageSize(data.episodesData.limit - data.episodesData.offset);
    setCurrentPage(data.episodesData.offset / pageSize + 1);
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
    <>
      <EpisodeList episodes={episodesData.episodes} />
      <Pagination
        simple
        onChange={handlePaginationChange}
        current={currentPage}
        total={episodesData.totalCount}
        pageSize={pageSize}
        itemRender={itemRender}
      />
    </>
  );
}

