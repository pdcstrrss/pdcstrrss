import { parse } from 'node-html-parser';

export async function getAudioSourceFromExternalWebPage(url: string, selector = 'audio') {
  const html = await fetch(url).then((res) => res.text());
  const parsed = parse(html);
  return parsed.querySelector(selector)?.getAttribute('src');
}
