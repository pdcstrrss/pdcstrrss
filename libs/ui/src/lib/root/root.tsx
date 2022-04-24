import normalize from "normalize.css";
import root from "./root.css";
import { links as appHeaderLinks } from "~/components/app/AppHeader/AppHeader";
import SvgSprite from "~/components/SvgSprite";
import { Meta, Links, Outlet, ScrollRestoration, Scripts } from "@remix-run/react";
import { MetaFunction } from "@remix-run/server-runtime";

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
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div data-anonymous-index>
          <h1>Error</h1>
        </div>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}
