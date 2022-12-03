import { default as RcPagination, PaginationProps } from "rc-pagination";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import locale from "rc-pagination/lib/locale/en_US.js";
import "./Pagination.css";

export const Pagination = (props: PaginationProps) => (
  <RcPagination
    {...props}
    locale={locale}
    prevIcon={
      <button aria-label={locale.prev_page}>
        <svg focusable="false">
          <use xlinkHref="#chevron-left" />
        </svg>
      </button>
    }
    nextIcon={
      <button aria-label={locale.next_page}>
        <svg focusable="false">
          <use xlinkHref="#chevron-right" />
        </svg>
      </button>
    }
  />
);
