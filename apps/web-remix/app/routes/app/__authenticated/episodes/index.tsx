import clsx from 'clsx';
import { getEpisodesData, getFeeds, IEpisodesData } from '../../../../services/core.server';
import { EpisodeList, EpisodeListLinks, Pagination, PaginationLinks } from '@pdcstrrss/ui';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import { authenticator } from '../../../../services/auth.server';
import { IGetEpisodesApiResponse } from '../../../api/episodes';

interface EpisodesIndexLoaderResponse {
  episodesData: IEpisodesData;
}

async function getEpisodesFromApi(url: string): Promise<IGetEpisodesApiResponse> {
  const _url = new URL(url);
  _url.pathname = '/api/episodes';
  return fetch(_url.toString()).then((res) => res.json());
}

export function links() {
  return [...EpisodeListLinks(), ...PaginationLinks()];
}

export function searchParamToNumberOrUndefined(url: string, searchParamKey: string) {
  return new Promise<number | undefined>((resolve, reject) => {
    try {
      const _url = new URL(url);
      const param = _url.searchParams.get(searchParamKey);
      if (param && !Number.isNaN(parseInt(param))) {
        resolve(parseInt(param));
      } else {
        resolve(undefined);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const loader: LoaderFunction = async ({ request }): Promise<EpisodesIndexLoaderResponse | Response> => {
  try {
    const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId) throw new Error('User not found');
    const offset = await searchParamToNumberOrUndefined(request.url, 'offset');
    const limit = await searchParamToNumberOrUndefined(request.url, 'limit');
    const episodesData = await getEpisodesData({ userId, offset, limit });
    if (!episodesData.totalCount) {
      const feeds = await getFeeds({ userId });
      if (!feeds.length) return redirect('/feeds');
    }
    return { episodesData };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function Episodes() {
  const { episodesData: data } = useLoaderData<EpisodesIndexLoaderResponse>();
  const navigate = useNavigate();
  const [episodesData, setEpisodesData] = useState<IEpisodesData>(data);
  const [pageSize, setPageSize] = useState<number>(data.limit - data.offset);
  const [currentPage, setCurrentPage] = useState<number>((pageSize === 0 ? 0 : data.offset / pageSize) + 1);

  const getOffset = (page: number) => (page - 1) * pageSize;
  const getLimit = (page: number) => (page - 1) * pageSize + pageSize;
  const updateAggregateData = async (url: string) => {
    const data = await getEpisodesFromApi(url);
    setEpisodesData(data.episodesData);
    setPageSize(data.episodesData.limit - data.episodesData.offset);
    setCurrentPage(data.episodesData.offset / pageSize + 1);
  };
  const handlePaginationChange = (page: number) => {
    const url = new URL(document?.location.href);
    url.searchParams.set('offset', `${getOffset(page)}`);
    url.searchParams.set('limit', `${getLimit(page)}`);
    navigate(url.toString().replace(url.origin, ''));
    updateAggregateData(url.toString()).catch(console.error);
  };

  return (
    <div className="page container container-md">
      <header className="page-header">
        <h1 className="page-header-title">Episodes</h1>
      </header>
      {episodesData.episodes.length > 0 ? (
        <>
          <EpisodeList episodes={episodesData.episodes} />
          <Pagination
            simple
            onChange={handlePaginationChange}
            current={currentPage}
            total={episodesData.totalCount}
            pageSize={pageSize}
          />
        </>
      ) : (
        <div className="card">No episodes found.</div>
      )}
    </div>
  );
}
