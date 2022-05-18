import { Link } from '@remix-run/react';

import type { IEpisode } from '@pdcstrrss/core';
import styles from './EpisodeList.css';

interface IEpisodeListProps {
  episodes: IEpisode[];
}

export const EpisodeListLinks = () => [{ rel: 'stylesheet', href: styles }];

export const EpisodeListItem = ({ id, title, url, feed, published, image }: IEpisode) => {
  return (
    <article key={url} data-episode data-card>
      <header data-episode-header>
        <h2 className='h5 mb-0'>{title}</h2>
      </header>

      <figure data-episode-media>{image && <img data-episode-image src={image} alt={title} />}</figure>

      <div data-episode-meta>
        <a href={url}>{feed.title}</a>
        <time data-episode-datetime dateTime={new Date(published).toISOString()}>
          {Intl.DateTimeFormat(['sv-SE']).format(new Date(published))}
        </time>
      </div>
      <Link
        className="link-icon"
        to={{ search: `?episode=${id}` }}
        data-episode-media-button
        aria-label={`Play episode ${title} of ${feed.title}`}
      >
        <svg data-episode-media-icon data-icon>
          <use xlinkHref="#play" />
        </svg>
      </Link>
    </article>
  );
};

export const EpisodeList = ({ episodes }: IEpisodeListProps) => (
  <>
    {episodes.map((episode) => (
      <EpisodeListItem key={episode.id} {...episode} />
    ))}
  </>
);
