import './Pagination.css';

export type PaginationPropsParams = {
  totalAmountOfItems: number;
  currentPage: number;
  itemsPerPage: number;
};

export type PaginationPropsUrlTransformerParams = PaginationPropsParams & {
  newPage: number;
};

export type PaginationProps = PaginationPropsParams & {
  urlTransformer: (params: PaginationPropsUrlTransformerParams) => string;
};

export const Pagination = (props: PaginationProps) => {
  const { totalAmountOfItems, currentPage, itemsPerPage, urlTransformer } = props;
  const totalPages = Math.ceil(totalAmountOfItems / itemsPerPage);

  return (
    <ul className="pagination">
      {currentPage > 1 && (
        <li>
          <a href={urlTransformer({ totalAmountOfItems, currentPage, itemsPerPage, newPage: 1 })} aria-label="First">
            <svg focusable="false">
              <use xlinkHref="#chevron-left" />
            </svg>
            <svg focusable="false">
              <use xlinkHref="#chevron-left" />
            </svg>
          </a>
        </li>
      )}
      {currentPage > 1 && (
        <li>
          <a
            href={urlTransformer({ totalAmountOfItems, currentPage, itemsPerPage, newPage: currentPage - 1 })}
            aria-label="Previous"
          >
            <svg focusable="false">
              <use xlinkHref="#chevron-left" />
            </svg>
          </a>
        </li>
      )}
      <li>
        <span>
          {currentPage} / {totalPages}
        </span>
      </li>
      {currentPage < totalPages && (
        <li>
          <a
            href={urlTransformer({ totalAmountOfItems, currentPage, itemsPerPage, newPage: currentPage + 1 })}
            aria-label="Next"
          >
            <svg focusable="false">
              <use xlinkHref="#chevron-right" />
            </svg>
          </a>
        </li>
      )}
      {currentPage < totalPages && (
        <li>
          <a
            href={urlTransformer({ totalAmountOfItems, currentPage, itemsPerPage, newPage: totalPages })}
            aria-label="Last"
          >
            <svg focusable="false">
              <use xlinkHref="#chevron-right" />
            </svg>
            <svg focusable="false">
              <use xlinkHref="#chevron-right" />
            </svg>
          </a>
        </li>
      )}
    </ul>
  );
};
