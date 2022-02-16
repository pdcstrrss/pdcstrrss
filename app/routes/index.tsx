import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { FeedData, read } from "feed-reader";
import { parse } from "node-html-parser";
import { useInView } from "react-intersection-observer";

interface Episode {
  podcastTitle: string;
  podcastDescription: string;
  title: string;
  url: string;
  description: string;
  audioSource?: string;
  published: string;
}

interface ShopTalkShowEntry {
  title: string;
  link: string;
  description: string;
  published: string;
}

interface IndexLoaderData {
  episodes: Episode[];
  feeds: FeedData[];
}

async function getAudioSource(url: string) {
  const html = await fetch(url).then((res) => res.text());
  const parsed = parse(html);
  return parsed.querySelector("audio")?.getAttribute("src");
}

export const loader: LoaderFunction = async (): Promise<IndexLoaderData> => {
  const feedUrls = ["https://shoptalkshow.com/feed/"];
  const feeds = await Promise.all(feedUrls.map(async (feedUrl) => read(feedUrl)));
  const episodes = await Promise.all(
    feeds
      .reduce((acc, feed) => {
        const entries = feed.entries.map(({ title, description, link, published }: ShopTalkShowEntry) => {
          return {
            podcastTitle: feed.title,
            podcastDescription: feed.description,
            title,
            url: link,
            description,
            published,
          };
        });
        return [...acc, ...entries];
      }, [] as Episode[])
      .filter((ep, index) => index < 10)
      .map(async (ep): Promise<Episode> => {
        const audioSource = await getAudioSource(ep.url);
        return {
          ...ep,
          audioSource,
        };
      })
  );

  return { episodes, feeds };
};

export default function Index() {
  const { episodes, feeds } = useLoaderData<IndexLoaderData>();

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      <h1 style={{ margin: ".75rem 0 0 0", fontSize: "1.5rem" }}>PODCSTRRSS</h1>
      {episodes.map(({ title, url, podcastTitle, published, audioSource }) => {
        const { ref, inView, entry } = useInView({
          threshold: 0,
          triggerOnce: false,
        });
        return (
          <article key={url} style={{ border: "1px solid #111", padding: "1rem" }}>
            <h2 style={{ margin: "0 0 .5rem", lineHeight: 1, fontSize: "1.125rem" }}>{title}</h2>
            <p>
              <a href={url}>{podcastTitle}</a>
              <span> - </span>
              <span>{Intl.DateTimeFormat(["sv-SE"]).format(new Date(published))}</span>
            </p>
            {audioSource && (
              <div ref={ref} style={{ height: "54px" }}>
                {inView && <audio src={audioSource} controls style={{}} />}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
