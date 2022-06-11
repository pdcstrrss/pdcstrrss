import { getUserById } from './services/core.server';
import { BaseLayout, BaseLayoutLinks } from '@pdcstrrss/ui';
import { useMatches, Meta, Links, Outlet, ScrollRestoration, Scripts, useCatch, useLoaderData } from '@remix-run/react';
import { LoaderFunction, MetaFunction } from '@remix-run/server-runtime';
import { authenticator } from './services/auth.server';
import type { User } from '@pdcstrrss/database';
import type { PropsWithChildren } from 'react';

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

interface LayoutProps {
  hero?: boolean;
  user?: User;
  globals?: string;
  title?: string;
  header?: boolean;
  footer?: boolean;
}

const Layout = ({ hero, user, globals, title, header, footer, children }: PropsWithChildren<LayoutProps>) => (
  <BaseLayout
    hero={hero}
    user={user}
    header={header}
    footer={footer}
    head={
      <>
        {title && <title>{title}</title>}
        <Meta />
        <Links />
        <script defer data-domain="pdcstrrss.app" src="/js/stats.js" data-api="/stats/event"></script>
      </>
    }
  >
    {children}
    {globals && (
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `window.GLOBALS=${globals};`,
        }}
      />
    )}
    <Scripts />
  </BaseLayout>
);

export default function App() {
  const { user, GLOBALS } = useLoaderData<RootLoaderData>();
  const matches = useMatches();
  const hasHero = !!matches.find(({ handle }) => handle && handle.hero);
  return (
    <Layout hero={hasHero} user={user} globals={GLOBALS}>
      <Outlet />
      <ScrollRestoration />
    </Layout>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
  const title = 'Error';
  console.error(error);
  return (
    <Layout title={title} header={false} footer={false}>
      <div className="page container page-centered text-center">
        <h1>Error</h1>
      </div>
    </Layout>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const title = 'Oh no';
  return (
    <Layout title={title}>
      <div className="page container page-centered text-center">
        <div>
          <h1 style={{ fontSize: 'var(--step-10)' }}>{caught.status}</h1>
          <p>{caught.statusText}</p>
        </div>
      </div>
    </Layout>
  );
}
