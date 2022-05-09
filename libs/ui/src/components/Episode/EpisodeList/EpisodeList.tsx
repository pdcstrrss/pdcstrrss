import { useNavigate } from "@remix-run/react";
import { Button, ButtonLinks } from "../../Button";
import type { IEpisode } from "@pdcstrrss/core";
import styles from "./EpisodeList.css";

interface IEpisodeListProps {
  episodes: IEpisode[];
}

export const EpisodeListLinks = () => [...ButtonLinks(), { rel: "stylesheet", href: styles }];

export const EpisodeListItem = ({ title, url, feed, published, image }: IEpisode) => {
  const navigate = useNavigate();

  const handleOnClick = (episodeUrl: string) => {
    const url = new URL(document.location.href);
    url.searchParams.set("episode", episodeUrl);
    window.location.href = url.toString();
  };

  return (
    <article key={url} data-episode>

      <header data-episode-header>
        <h2 data-episode-title>{title}</h2>
      </header>

      <figure data-episode-media>{image && <img data-episode-image src={image} alt={title} />}</figure>

      <div data-episode-meta>
        <a href={url}>{feed.title}</a>
        <time data-episode-datetime dateTime={new Date(published).toISOString()}>
          {Intl.DateTimeFormat(["sv-SE"]).format(new Date(published))}
        </time>
      </div>
      <Button
        onClick={() => handleOnClick(url)}
        data-episode-media-button
        reset
        aria-label={`Play episode ${title} of ${feed.title}`}
      >
        <svg data-episode-media-icon data-icon>
          <use xlinkHref="#play" />
        </svg>
      </Button>
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
