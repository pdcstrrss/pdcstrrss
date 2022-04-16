import { useNavigate } from "remix";
import { Button, links as buttonLinks } from "~/components/Button/Button";
import { BASE_URL } from "~/lib/constants";
import type { Episode } from "~/lib/types";
import styles from "./EpisodeList.css";

interface EpisodeListItemProps extends Episode {}

interface EpisodeListProps {
  episodes: Episode[];
}

export const links = () => [...buttonLinks(), { rel: "stylesheet", href: styles }];

export const EpisodeListItem = ({ title, url, podcastTitle, published }: EpisodeListItemProps) => {
  let navigate = useNavigate();

  const handleOnClick = (episodeUrl: string) => {
    const url = new URL(document.location.href);
    url.searchParams.set("episode", episodeUrl);
    window.location.href = url.toString();
  };

  return (
    <article key={url} data-episode>
      <h2 data-episode-title>{title}</h2>
      <div data-episode-meta>
        <a href={url}>{podcastTitle}</a>
        <time data-episode-datetime dateTime={new Date(published).toISOString()}>
          {Intl.DateTimeFormat(["sv-SE"]).format(new Date(published))}
        </time>
      </div>
      <Button
        onClick={() => handleOnClick(url)}
        data-episode-media-button
        reset
        aria-label={`Play episode ${title} of ${podcastTitle}`}
      >
        <svg data-episode-media-icon data-icon>
          <use xlinkHref="#play" />
        </svg>
      </Button>
    </article>
  );
};

export const EpisodeList = ({ episodes }: EpisodeListProps) => (
  <>
    {episodes.map((episode) => (
      <EpisodeListItem key={episode.url} {...episode} />
    ))}
  </>
);
