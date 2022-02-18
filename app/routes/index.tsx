import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { useInView } from "react-intersection-observer";
import aggregator, { Feed } from "~/lib/aggregator";
import { useEffect, useState } from "react";

interface Episode {
  podcastTitle: string;
  podcastDescription: string;
  title: string;
  url: string;
  description: string;
  published: string;
}

interface IndexLoaderData {
  episodes: Episode[];
  feeds: Feed[];
}

export const loader: LoaderFunction = async (): Promise<IndexLoaderData> => {
  const { episodes, feeds } = await aggregator();
  return { episodes, feeds };
};

export default function Index() {
  const { episodes } = useLoaderData<IndexLoaderData>();

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
      {episodes.map(({ title, url, podcastTitle, published }) => {
        const [audioSource, setAudioSource] = useState<string | undefined>(undefined);
        const { ref, inView, entry } = useInView({
          threshold: 0,
          triggerOnce: true,
        });

        useEffect(() => {
          if (inView) {
            const audioApiUrl = new URL(document.location + "audio");
            audioApiUrl.searchParams.append("url", url);
            const fetchAudioSource = async () => {
              const data = await fetch(audioApiUrl.toString()).then((res) => res.json());
              setAudioSource(data);
            };
            fetchAudioSource().catch(console.error);
          }
        }, [inView]);

        return (
          <article key={url} style={{ border: "1px solid #111", padding: "1rem" }}>
            <h2 style={{ margin: "0 0 .5rem", lineHeight: 1, fontSize: "1.125rem" }}>{title}</h2>
            <p>
              <a href={url}>{podcastTitle}</a>
              <span> - </span>
              <span>{Intl.DateTimeFormat(["sv-SE"]).format(new Date(published))}</span>
            </p>
            <div ref={ref} style={{ height: "54px" }}>
              {inView && <audio src={audioSource} controls />}
            </div>
          </article>
        );
      })}
    </div>
  );
}
