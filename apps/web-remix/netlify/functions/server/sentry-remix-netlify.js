// @ts-check
const { createRequestHandler: createRemixRequestHandler, installGlobals, AbortController } = require('@remix-run/node');
const { createRemixRequest, sendRemixResponse } = require('@remix-run/netlify/server');
const Sentry = require('@sentry/node');
let { isResponse } = require('@remix-run/server-runtime/responses');
const { v4: uuid } = require('uuid');

installGlobals();

/**
 *
 * @param {(...args: unknown[]) => unknown} func
 * @param {string} routeId
 * @param {string} method
 */
function wrapDataFunc(func, routeId, method) {
  const ogFunc = func;

  return async (...args) => {
    /** @type {import("@sentry/types").Transaction | undefined} */
    const parentTransaction = args[0].context && args[0].context.__sentry_transaction;
    const transaction =
      parentTransaction &&
      parentTransaction.startChild({
        op: `${method}:${routeId}`,
        description: `${method}: ${routeId}`,
      });
    transaction && transaction.setStatus('ok');
    transaction && (transaction.transaction = parentTransaction);

    try {
      return await ogFunc(...args);
    } catch (error) {
      if (isResponse(error)) {
        throw error;
      }

      Sentry.captureException(error, {
        tags: {
          global_id: parentTransaction && parentTransaction.tags['global_id'],
        },
      });
      transaction.setStatus('internal_error');
      throw error;
    } finally {
      transaction && transaction.finish();
    }
  };
}

/**
 * Register Sentry across your entire remix build.
 * @param {import("@remix-run/node").ServerBuild} build
 */
function registerSentry(build) {
  /** @type {Record<string, build["routes"][string]>} */
  let routes = {};

  for (let [id, route] of Object.entries(build.routes)) {
    /** @type {build["routes"][string]} */
    let newRoute = { ...route, module: { ...route.module } };

    if (route.module.action) {
      newRoute.module.action = wrapDataFunc(route.module.action, id, 'action');
    }

    if (route.module.loader) {
      newRoute.module.loader = wrapDataFunc(route.module.loader, id, 'loader');
    }

    routes[id] = newRoute;
  }

  return {
    ...build,
    routes,
  };
}

/**
 *
 * @param {import("@netlify/functions").HandlerEvent} event
 * @param {import("@netlify/functions").HandlerContext} context
 * @returns
 */
function sentryLoadContext(event, context) {
  const transaction = Sentry.getCurrentHub().startTransaction({
    op: 'request',
    name: `${event.httpMethod}: ${event.url}`,
    description: `${event.httpMethod}: ${event.url}`,
    metadata: {
      requestPath: event.url,
    },
    tags: {
      global_id: uuid(),
    },
  });
  transaction && transaction.setStatus('internal_error');

  return {
    __sentry_transaction: transaction,
  };
}

/**
 *
 * @param {{
 *   build: import("@remix-run/node").ServerBuild,
 *   mode:string
 * }} args
 * @returns {import("@remix-run/node").RequestHandler}
 */

function createRequestHandler({ build, mode = process.env.NODE_ENV }) {
  let handleRequest = createRemixRequestHandler(build, mode);

  return async (event, context) => {
    let abortController = new AbortController();
    let request = createRemixRequest(event);
    let loadContext = sentryLoadContext(event, context);
    let response = await handleRequest(request, loadContext);

    if (loadContext.__sentry_transaction) {
      loadContext.__sentry_transaction.setHttpStatus(response.statusCode);
      loadContext.__sentry_transaction.setTag('http.status_code', response.statusCode);
      loadContext.__sentry_transaction.setTag('http.method', event.httpMethod);
      loadContext.__sentry_transaction.finish();
    }

    return sendRemixResponse(response, abortController);
  };
}

exports.registerSentry = registerSentry;
exports.createRequestHandler = createRequestHandler;
