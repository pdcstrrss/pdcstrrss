import type { IFeed } from '@pdcstrrss/core';
import './FeedList.css';

export type IFeedListItemProps = IFeed & {
  deleteUrl: string;
};

interface IFeedListProps {
  getDeleteUrl: (id: string) => string;
  feeds: IFeed[];
}

export const FeedListItem = ({ id, title, url, latestEpisodePublished, image, deleteUrl }: IFeedListItemProps) => {
  return (
    <article key={id} className="feed card">
      <header className="feed-header">
        <h2 className="h5 feed-title">{title}</h2>
      </header>

      <figure className="feed-media">{image && <img className="feed-image" src={image} alt={title} />}</figure>

      <div className="feed-meta">
        <time className="feed-datetime" dateTime={latestEpisodePublished.toString()}>
          {Intl.DateTimeFormat(['sv-SE']).format(new Date(latestEpisodePublished))}
        </time>
      </div>

      <div className="feed-actions">
        <a className="link-icon" href={deleteUrl}>
          <svg>
            <use xlinkHref="#trash" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export const FeedList = ({ feeds, getDeleteUrl }: IFeedListProps) => {
  return (
    <div className="feed-list">
      {feeds.map((feed) => (
        <FeedListItem key={feed.url} {...feed} deleteUrl={getDeleteUrl(feed.id)} />
      ))}
    </div>
  );
};
