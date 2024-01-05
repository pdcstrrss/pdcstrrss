import { XMLParser } from 'fast-xml-parser';
import {} from 'validator';

export interface IRssFeedData {
  link?: string;
  title?: string;
  description?: string;
  generator?: string;
  language?: string;
  published?: Date;
  entries?: Array<unknown>;
}

export function parseRSS(rss: string): IRssFeedData | undefined {
  const parser = new XMLParser({ ignoreAttributes: false });
  const feedObj = parser.parse(rss);
  if (!feedObj?.rss?.channel) return undefined;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { link, title, description, generator, language, item: entries } = feedObj?.rss?.channel;
  return {
    link,
    title,
    description,
    generator,
    language,
    entries,
  };
}
