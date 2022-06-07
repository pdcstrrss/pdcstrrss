const prismaClient = require('@prisma/client');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const path = require('path');
const { registerSentry, createRequestHandler } = require('./sentry-remix-netlify');

const BUILD_DIR = path.join(process.cwd(), 'netlify');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

function loadBuild() {
  let build = require('./build');
  build = registerSentry(build);
  return build;
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
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
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}

const createRequestHandlerOptions = {
  build: loadBuild(),
  mode,
};

exports.handler =
  process.env.NODE_ENV === 'production'
    ? createRequestHandler(createRequestHandlerOptions)
    : (event, context) => {
        purgeRequireCache();
        return createRequestHandler(createRequestHandlerOptions)(event, context);
      };
