import isURL from "validator/lib/isURL";

export async function getAudioSource({ request }: { request: Request }) {
  const url = new URL(request.url);
  let urlParam = url.searchParams.get("episode");
  urlParam = isURL(urlParam || "") ? urlParam : null;
  if (urlParam) {
    const fetchUrl = new URL(url.origin + "/audio");
    fetchUrl.searchParams.set("url", urlParam);
    const audioSource: string = await fetch(fetchUrl.toString()).then((res) => res.json());
    return audioSource;
  }
}
