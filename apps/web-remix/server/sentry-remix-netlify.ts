// @ts-check
// import {installGlobals, AbortController } from '@remix-run/node';
// import { createRemixRequest, sendRemixResponse } from '@remix-run/netlify-edge/server';
import Sentry from '@sentry/node';
import { createRequestHandler as createRemixRequestHandler } from '@remix-run/server-runtime';
import { isResponse } from '@remix-run/server-runtime/responses';
import { v4 as uuid } from 'uuid';
import { ServerBuild } from '@remix-run/netlify-edge';

// installGlobals();

interface BaseContext {
  next: (options?: { sendConditionalRequest?: boolean }) => Promise<Response>;
}

function wrapDataFunc(func: unknown, routeId:unknown, method:unknown) {
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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

export function registerSentry(build: ServerBuild) {
  /** @type {Record<string, build["routes"][string]>} */
  const routes = {};

  for (const [id, route] of Object.entries(build.routes)) {
    /** @type {build["routes"][string]} */
    const newRoute = { ...route, module: { ...route.module } };

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

function sentryLoadContext(request: Request, context: BaseContext) {
  const transaction = Sentry.getCurrentHub().startTransaction({
    op: 'request',
    name: `${request.method}: ${request.url}`,
    description: `${request.method}: ${request.url}`,
    metadata: {
      requestPath: request.url,
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

export function createRequestHandler<Context extends BaseContext = BaseContext>({
  build,
  mode,
  getLoadContext,
}: {
  build: ServerBuild;
  mode?: string;
  getLoadContext?: (request: Request, context?: Context) => Promise<Context> | Context;
}) {
  const remixHandler = createRemixRequestHandler(build, mode);

  const assetPath = build.assets.url.split('/').slice(0, -1).join('/');

  return async (request: Request, context: Context): Promise<Response | void> => {
    const { pathname } = new URL(request.url);
    // Skip the handler for static files
    if (pathname.startsWith(`${assetPath}/`)) {
      return;
    }
    try {
      // let loadContext = getLoadContext ? await getLoadContext(request, context) : context;
      const loadContext = sentryLoadContext(request, context);

      const response = await remixHandler(request, loadContext);
      if (response.status === 404) {
        // Check if there is a matching static file
        const originResponse = await context.next({
          sendConditionalRequest: true,
        });
        if (originResponse.status !== 404) {
          return originResponse;
        }
      }

      if (loadContext.__sentry_transaction) {
        loadContext.__sentry_transaction.setHttpStatus(response.status);
        loadContext.__sentry_transaction.setTag('http.status_code', response.status);
        loadContext.__sentry_transaction.setTag('http.method', request.method);
        loadContext.__sentry_transaction.finish();
      }

      return response;
    } catch (e) {
      console.error(e);

      return new Response('Internal Error', { status: 500 });
    }
  };
}
