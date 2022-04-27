import { Form } from '@remix-run/react';
import { useNavigate } from '@remix-run/react';
import { Button, ButtonLinks } from '../../Button';
import type { IFeed } from '@pdcstrrss/core';
import styles from './FeedList.css';

export type IFeedListItemProps = IFeed;

interface IFeedListProps {
  feeds: IFeedListItemProps[];
}

export const FeedListLinks = () => [...ButtonLinks(), { rel: 'stylesheet', href: styles }];

export const FeedListItem = ({ id, title, url, latestEpisodePublished, image, subscribed }: IFeedListItemProps) => {
  // let navigate = useNavigate();

  // const handleOnClick = (feedUrl: string) => {
  //   const url = new URL(document.location.href);
  //   url.searchParams.set("feed", feedUrl);
  //   window.location.href = url.toString();
  // };

  return (
    <article key={id} data-feed>
      <header data-feed-header>
        <h2 data-feed-title>{title}</h2>
      </header>

      <figure data-feed-media>{image && <img data-feed-image src={image} alt={title} />}</figure>

      <div data-feed-meta>
        <time data-feed-datetime dateTime={latestEpisodePublished.toString()}>
          {Intl.DateTimeFormat(['sv-SE']).format(new Date(latestEpisodePublished))}
        </time>
      </div>

      <input type="checkbox" name='feeds' value={id} defaultChecked={subscribed} />
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
  <div data-feed-list>
    {feeds.map((feed) => (
      <FeedListItem key={feed.url} {...feed} />
    ))}
  </div>
);
