import { Pagination, PaginationPropsUrlTransformerParams } from '@pdcstrrss/ui';

export type UsePaginationFiltersParams = {
  url: string;
  limit?: number;
  offset?: number;
};

const getOffset = (page: number, itemsPerPage: number) => (page - 1) * itemsPerPage;
const getLimit = (page: number, itemsPerPage: number) => (page - 1) * itemsPerPage + itemsPerPage;

const urlTransformer = (urlString: string) => (params: PaginationPropsUrlTransformerParams) => {
  const url = new URL(urlString);
  const urlOffset = getOffset(params.newPage, params.itemsPerPage);
  if (urlOffset === 0) {
    url.searchParams.delete('offset');
    url.searchParams.delete('limit');
  } else {
    const urlLimit = getLimit(params.newPage, params.itemsPerPage);
    url.searchParams.set('offset', `${urlOffset}`);
    url.searchParams.set('limit', `${urlLimit}`);
  }
  return url.toString();
};

function usePaginationFilters(data: UsePaginationFiltersParams) {
  const itemsPerPage = (data?.limit || 0) - (data?.offset || 0);
  const currentPage = (itemsPerPage === 0 ? 0 : (data?.offset || 0) / itemsPerPage) + 1;

  return {
    Pagination,
    itemsPerPage,
    currentPage,
    getOffset,
    getLimit,
    urlTransformer: urlTransformer(data.url),
  };
}

export default usePaginationFilters;
