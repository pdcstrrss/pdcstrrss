import parse from "node-html-parser";
import { LoaderFunction } from "remix";

async function getAudioSource(url: string, selector: string = "audio") {
  const html = await fetch(url).then((res) => res.text());
  const parsed = parse(html);
  return parsed.querySelector(selector)?.getAttribute("src");
}

export const loader: LoaderFunction = async ({ request }) => {
  const urlParam = new URL(request.url).searchParams.get("url");
  if (urlParam) {
    if (urlParam.includes(".mp3")) {
      return urlParam;
    }
    const source = await getAudioSource(urlParam);
    if (source) {
      return source;
    }
  }

  return new Response(null, {
    status: 404,
  });
};
