import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

declare global {
  interface Window {
    GLOBALS: Record<string, string | undefined>;
  }
}

Sentry.init({
  dsn: window.GLOBALS.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [new Integrations.BrowserTracing()],
});

hydrateRoot(document, <RemixBrowser />);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import('focus-visible');
