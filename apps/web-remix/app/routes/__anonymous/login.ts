import { LoaderFunction, redirect } from '@remix-run/server-runtime';
import routes from '../../lib/routes';

import { redirectCookie } from '../../services/cookie.server';

export const loader: LoaderFunction = async ({ request }) => {
  const baseUrl = process.env.BASE_URL;
  const referer = request.headers.get('x-remix-redirect') || request.headers.get('referer');

  console.debug('---');
  console.debug({
    baseUrl,
    referer,
    includesBase: baseUrl && referer?.includes(baseUrl),
    pathname: referer && new URL(referer).pathname,
    includesPath: referer && ['/app/account'].includes(new URL(referer).pathname),
  });
  console.debug('---');

  if (referer && baseUrl && referer?.includes(baseUrl)) {
    const { pathname } = new URL(referer);
    if (['/app/account'].includes(pathname)) {
      const headers = new Headers({ 'Set-Cookie': await redirectCookie.serialize(pathname) });
      return redirect(routes.github, { headers });
    }
  }

  return redirect(routes.github);
};
