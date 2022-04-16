import { XMLParser } from "fast-xml-parser";
import { FeedData } from "./types";

export function parseRSS(rss: string): FeedData | undefined {
  const parser = new XMLParser({ ignoreAttributes: false });
  const feedObj = parser.parse(rss);
  if (!feedObj?.rss?.channel) return undefined;
  const { link, title, description, generator, language, pubDate: published, item: entries } = feedObj?.rss?.channel;
  return {
    link,
    title,
    description,
    generator,
    language,
    published,
    entries,
  };
}
