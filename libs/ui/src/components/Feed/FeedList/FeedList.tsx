import { useNavigate } from '@remix-run/react';
import { Button, ButtonLinks } from '../../Button';
import type { IFeed } from '@pdcstrrss/core';
import styles from './FeedList.css';

export type IFeedListItemProps = IFeed;

interface IFeedListProps {
  feeds: IFeedListItemProps[];
}

export const FeedListLinks = () => [...ButtonLinks(), { rel: 'stylesheet', href: styles }];

export const FeedListItem = ({ title, url, latestEpisodePublished, image }: IFeedListItemProps) => {
  // let navigate = useNavigate();

  // const handleOnClick = (feedUrl: string) => {
  //   const url = new URL(document.location.href);
  //   url.searchParams.set("feed", feedUrl);
  //   window.location.href = url.toString();
  // };

  return (
    <article key={url} data-feed>
      <header data-feed-header>
        <h2 data-feed-title>{title}</h2>
      </header>

      <figure data-feed-media>{image && <img data-feed-image src={image} alt={title} />}</figure>

      <div data-feed-meta>
        <time data-feed-datetime dateTime={latestEpisodePublished.toString()}>
          {Intl.DateTimeFormat(['sv-SE']).format(new Date(latestEpisodePublished))}
        </time>
      </div>
      {/* <Button
        onClick={() => handleOnClick(url)}
        data-feed-media-button
        reset
        aria-label={`Play feed ${title} of ${feed.title}`}
      >
        <svg data-feed-media-icon data-icon>
          <use xlinkHref="#play" />
        </svg>
      </Button> */}
    </article>
  );
};

export const FeedList = ({ feeds }: IFeedListProps) => (
  <>
    {feeds.map((feed) => (
      <FeedListItem key={feed.url} {...feed} />
    ))}
  </>
);
