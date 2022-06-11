import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

declare global {
  interface Window {
    GLOBALS: Record<string, string | undefined>;
  }
}

if (window.GLOBALS?.SENTRY_DSN) {
  Sentry.init({
    dsn: window.GLOBALS.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [new Integrations.BrowserTracing()],
  });
}

hydrateRoot(document, <RemixBrowser />);

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import('focus-visible');
// @ts-ignore
import('inert-polyfill');
/* eslint-enable @typescript-eslint/ban-ts-comment */
