import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/server-runtime';
import routes from '../../../lib/routes';
import { authenticator } from '../../../services/auth.server';

export const loader: LoaderFunction = async ({ request }): Promise<Response> => {
  const isAuthenticated = await authenticator.isAuthenticated(request);
  if (isAuthenticated) {
    return redirect(routes.episodes);
  }
  return redirect(routes.account);
};
