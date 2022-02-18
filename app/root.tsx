import normalize from "normalize.css";
import root from "./root.css";
import { links as appHeaderLinks } from "~/components/app/AppHeader/AppHeader";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "remix";
import type { MetaFunction } from "remix";

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
        <div hidden>
          <svg>
            <defs>
              <symbol id="play" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5l-6 4.5z"
                ></path>
              </symbol>
            </defs>
          </svg>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
