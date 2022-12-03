import type { IEpisode } from '@pdcstrrss/core';
import './EpisodeList.module.css';

interface IEpisodeListProps {
  episodes: IEpisode[];
}

export const EpisodeListItem = ({ id, title, url, feed, published, image }: IEpisode) => {
  const mediaUrl = new URL(window.location.toString());
  mediaUrl.searchParams.set('episode', id);

  return (
    <article key={url} className="episode card">
      <header className="episode-header">
        <h2 className="h5 mb-0">{title}</h2>
      </header>
      <figure className="episode-media">
        {image ? (
          <img className="episode-image" src={image} alt={title} width="100px" height="100px" />
        ) : (
          <svg className="episode-image-empty">
            <use xlinkHref="#image-remove" />
          </svg>
        )}
      </figure>
      <div className="episode-meta">
        {feed.link ? (
          <a href={feed.link} target="_blank" rel="noopener noreferrer">
            {feed.title}
          </a>
        ) : (
          <span>{feed.title}</span>
        )}
        <time className="episode-datetime" dateTime={new Date(published).toISOString()}>
          {Intl.DateTimeFormat(['sv-SE']).format(new Date(published))}
        </time>
      </div>
      <a
        className="link-icon link-icon-primary episode-media-button"
        href={mediaUrl.toString()}
        aria-label={`Play episode ${title} of ${feed.title}`}
      >
        <svg className="episode-media-icon" data-icon>
          <use xlinkHref="#play" />
        </svg>
      </a>
    </article>
  );
};

export const EpisodeList = ({ episodes }: IEpisodeListProps) => (
  <div className="episodes">
    {episodes.map((episode) => (
      <EpisodeListItem key={episode.id} {...episode} />
    ))}
  </div>
);
