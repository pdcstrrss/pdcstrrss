import { BaseLayout, BaseLayoutLinks } from '@pdcstrrss/ui';
import { Meta, Links, Outlet, ScrollRestoration, Scripts, useCatch } from '@remix-run/react';
import { MetaFunction } from '@remix-run/server-runtime';

export function links() {
  return BaseLayoutLinks();
}

export const meta: MetaFunction = () => {
  return { title: 'PDCSTRRSS' };
};

export default function App() {
  return (
    <BaseLayout
      head={
        <>
          <Meta />
          <Links />
        </>
      }
    >
      <Outlet />
      <ScrollRestoration />
      <Scripts />
    </BaseLayout>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
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
      <Scripts />
    </BaseLayout>
  );
}

export function CatchBoundary() {
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
      <Scripts />
    </BaseLayout>
  );
}
