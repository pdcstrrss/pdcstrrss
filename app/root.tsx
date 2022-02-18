import normalize from "normalize.css";
import root from "./root.css";
import { links as appHeaderLinks } from "~/components/app/AppHeader/AppHeader";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "remix";
import type { MetaFunction } from "remix";
import SvgSprite from "~/components/SvgSprite";

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

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SvgSprite />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
