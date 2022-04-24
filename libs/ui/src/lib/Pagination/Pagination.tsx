import { default as RcPagination, PaginationProps } from "rc-pagination";
// @ts-ignore
import locale from "rc-pagination/lib/locale/en_US.js";
import styles from "./Pagination.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const Pagination = (props: PaginationProps) => (
  <RcPagination
    {...props}
    locale={locale}
    prevIcon={
      <button>
        <svg>
          <use xlinkHref="#chevron-left" />
        </svg>
      </button>
    }
    nextIcon={
      <button>
        <svg>
          <use xlinkHref="#chevron-right" />
        </svg>
      </button>
    }
  />
);
