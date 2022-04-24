import { XMLParser } from "fast-xml-parser";
import { IFeedData } from "../types";

export function parseRSS(rss: string): IFeedData | undefined {
  const parser = new XMLParser({ ignoreAttributes: false });
  const feedObj = parser.parse(rss);
  if (!feedObj?.rss?.channel) return undefined;
  // eslint-disable-next-line no-unsafe-optional-chaining
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
