import prismaClient from '@prisma/client';
import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
// import path from 'path';
import { registerSentry, createRequestHandler } from './sentry-remix-netlify.ts';
import * as build from '@remix-run/dev/server-build';

// const BUILD_DIR = path.join(process.cwd(), 'server');

const mode = Deno.env.get('NODE_ENV') === 'development' ? 'development' : 'production';

function loadBuild() {
  return registerSentry(build);
}

Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN'),
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Prisma({ client: prismaClient }),
  ],
  tracesSampleRate: 1.0,
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // netlify typically does this for you, but we've found it to be hit or
  // miss and some times requires you to refresh the page after it auto reloads
  // or even have to restart your server
  // Cannot find name 'require'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
  // for (const key in require.cache) {
  //   if (key.startsWith(BUILD_DIR)) {
  //     delete require.cache[key];
  //   }
  // }
}

const createRequestHandlerOptions = {
  build: loadBuild(),
  mode,
};

export default Deno.env.get('NODE_ENV') === 'production'
  ? createRequestHandler(createRequestHandlerOptions)
  : (request: Request, context: any) => {
      purgeRequireCache();
      return createRequestHandler(createRequestHandlerOptions)(request, context);
    };
