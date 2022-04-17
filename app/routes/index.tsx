import { useLoaderData, useNavigate } from "remix";
import { useState } from "react";
import type { LoaderFunction } from "remix";
import { AggregateResponse } from "./aggregate";
import { AppHeader } from "~/components/app/AppHeader/AppHeader";
import { EpisodeList, links as episodeListLinks } from "~/components/episode/EpisodeList/EpisodeList";
import { Pagination, links as paginationLinks } from "~/components/Pagination/Pagination";
import { authenticator } from "~/services/auth.server";
import { User } from "@prisma/client";
import { Button } from "~/components/Button/Button";
import styles from "./index.css";

async function getAggregateData(url: string) {
  const _url = new URL(url);
  _url.pathname = "/aggregate";
  return fetch(_url.toString()).then((res) => res.json());
}

export function links() {
  return [...episodeListLinks(), ...paginationLinks(), { rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async ({ request }): Promise<{ data?: AggregateResponse; user: User | null }> => {
  try {
    const user = await authenticator.isAuthenticated(request);
    if (user) {
      const data = await getAggregateData(request.url);
      return { data, user };
    } else {
      return { user };
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

function AnonymousIndex() {
  return (
    <div data-anonymous-index>
      <h1>PDCSTRRSS</h1>
      <p>The RSS PodCast PWA</p>
      <ul className="list-unstyled">
        <li>Login with GitHub</li>
        <li>Sponsor the project for only <strong>$1 / month</strong></li>
        <li>Configure</li>
        <li>Listen</li>
      </ul>
      <form action="/auth/github" method="post" style={{ display: "inline-block" }}>
        <Button>
          <svg style={{ inlineSize: "var(--space)", blockSize: "var(--space)" }}>
            <use xlinkHref="#github" />
          </svg>
          <span>Login with GitHub</span>
        </Button>
      </form>
    </div>
  );
}

function AuthenticatedIndex({ loaderData, user }: { loaderData: AggregateResponse; user: User }) {
  let navigate = useNavigate();
  let [episodesData, setEpisodesData] = useState<AggregateResponse["episodes"]>(loaderData.episodes);
  let [pageSize, setPageSize] = useState<number>(loaderData.episodes.limit - loaderData.episodes.offset);
  let [currentPage, setCurrentPage] = useState<number>(loaderData.episodes.offset / pageSize + 1);

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
    <>
      <AppHeader user={user} />
      <EpisodeList episodes={episodesData.data} />
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

export default function Index() {
  const { data, user } = useLoaderData<{ data: AggregateResponse; user: User }>();

  return (
    <div data-page-index>{!!user ? <AuthenticatedIndex loaderData={data} user={user} /> : <AnonymousIndex />}</div>
  );
}
