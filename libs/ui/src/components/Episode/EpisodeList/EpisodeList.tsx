import { EpisodeStatus } from '@prisma/client';
import type { IEpisodeOfUser } from '@pdcstrrss/core';
import { FORM_ACTIONS, FORM_SUBJECTS, Button } from '../../../';
import './EpisodeList.css';

interface IEpisodeListProps {
  episodes: IEpisodeOfUser[];
}

export const EpisodeListItem = ({ id, title, url, feed, published, image, status }: IEpisodeOfUser) => {
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
      <form method="POST">
        <input type="hidden" name="status" value={EpisodeStatus.PLAYING} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="action" value={FORM_ACTIONS.STATUS} />
        <input type="hidden" name="subject" value={FORM_SUBJECTS.EPISODE} />
        <Button
          type="submit"
          link
          className="episode-media-button"
          aria-label={`Play episode ${title} of ${feed.title}`}
        >
          <svg className="episode-media-icon" data-icon>
            <use xlinkHref="#play" />
          </svg>
        </Button>
      </form>
      {status === EpisodeStatus.NEW && <div className="episode-status">{status}</div>}
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
