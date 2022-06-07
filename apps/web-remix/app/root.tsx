import { getUserById } from './services/core.server';
import { BaseLayout, BaseLayoutLinks } from '@pdcstrrss/ui';
import { useMatches, Meta, Links, Outlet, ScrollRestoration, Scripts, useCatch, useLoaderData } from '@remix-run/react';
import { LoaderFunction, MetaFunction } from '@remix-run/server-runtime';
import { authenticator } from './services/auth.server';
import type { User } from '@pdcstrrss/database';

interface RootLoaderData {
  user?: User;
  GLOBALS: string;
}

export function links() {
  return BaseLayoutLinks();
}

export const meta: MetaFunction = () => {
  return { title: 'PDCSTRRSS' };
};

export const loader: LoaderFunction = async ({ request }): Promise<RootLoaderData | Response> => {
  try {
    const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
    const user = userId ? (await getUserById(userId)) || undefined : undefined;
    return {
      user,
      GLOBALS: JSON.stringify({
        SENTRY_DSN: process.env.SENTRY_DSN,
      }),
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function App() {
  const { user, GLOBALS } = useLoaderData<RootLoaderData>();
  const matches = useMatches();
  const hasHero = !!matches.find(({ handle }) => handle && handle.hero);
  return (
    <BaseLayout
      hero={hasHero}
      user={user}
      head={
        <>
          <Meta />
          <Links />
        </>
      }
    >
      <Outlet />
      <ScrollRestoration />
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `window.GLOBALS=${GLOBALS};`,
        }}
      />
      <Scripts />
    </BaseLayout>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
  const { GLOBALS } = useLoaderData<RootLoaderData>();
  console.error(error);
  return (
    <BaseLayout
      head={
        <>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </>
      }
    >
      <div data-anonymous-index>
        <h1>Error</h1>
      </div>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `window.GLOBALS=${GLOBALS};`,
        }}
      />
      <Scripts />
    </BaseLayout>
  );
}

export function CatchBoundary() {
  const { GLOBALS } = useLoaderData<RootLoaderData>();
  const caught = useCatch();
  return (
    <BaseLayout
      head={
        <>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </>
      }
    >
      <div data-anonymous-index>
        <div>
          <h1 style={{ fontSize: '6rem' }}>{caught.status}</h1>
          <p>{caught.statusText}</p>
        </div>
      </div>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `window.GLOBALS=${GLOBALS};`,
        }}
      />
      <Scripts />
    </BaseLayout>
  );
}
