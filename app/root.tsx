import normalize from "normalize.css";
import root from "./root.css";
import { links as appHeaderLinks } from "~/components/app/AppHeader/AppHeader";
import { Links, LiveReload, LoaderFunction, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "remix";
import type { MetaFunction } from "remix";
import SvgSprite from "~/components/SvgSprite";
import isURL from "validator/lib/isURL";

export function links() {
  return [
    ...appHeaderLinks(),
    ...[normalize, "https://rsms.me/inter/inter.css", root].map((href) => ({
      href,
      rel: "stylesheet",
    })),
  ];
}

export const meta: MetaFunction = () => {
  return { title: "PDCSTRRSS" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  let urlParam = url.searchParams.get("episode");
  urlParam = isURL(urlParam || "") ? urlParam : null;
  if (urlParam) {
    const fetchUrl = new URL(url.origin + "/audio");
    fetchUrl.searchParams.set("url", urlParam);
    const audioSource = await fetch(fetchUrl.toString()).then((res) => res.json());
    return { audioSource };
  }

  return {};
};

export default function App() {
  const { audioSource } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body data-body-with-audio-player={audioSource}>
        <SvgSprite />
        <Outlet />
        {audioSource && (
          <div data-audio-player>
            <audio src={audioSource} controls />
          </div>
        )}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
