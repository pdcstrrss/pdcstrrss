import type { IFeed } from '@pdcstrrss/core';
import './FeedList.css';

export type IFeedListItemProps = IFeed;

interface IFeedListProps {
  feeds: IFeedListItemProps[];
}

// export const FeedListLinks = () => [{ rel: 'stylesheet', href: styles }];

export const FeedListItem = ({ id, title, url, latestEpisodePublished, image }: IFeedListItemProps) => {
  return (
    <article key={id} data-feed data-card>
      <header data-feed-header>
        <h2 className='h4 feed-title'>{title}</h2>
      </header>

      <figure data-feed-media>{image && <img data-feed-image src={image} alt={title} />}</figure>

      <div data-feed-meta>
        <time data-feed-datetime dateTime={latestEpisodePublished.toString()}>
          {Intl.DateTimeFormat(['sv-SE']).format(new Date(latestEpisodePublished))}
        </time>
      </div>

      <div data-feed-actions>
        <a className='link-icon' href={`/app/feeds/${id}/delete`}>
          <svg>
            <use xlinkHref="#trash" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export const FeedList = ({ feeds }: IFeedListProps) => {
  return (
    <div data-feed-list>
      {feeds.map((feed) => (
        <FeedListItem key={feed.url} {...feed} />
      ))}
    </div>
  );
};
