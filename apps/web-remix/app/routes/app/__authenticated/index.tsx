import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/server-runtime';
import { authenticator } from '../../../services/auth.server';

export const loader: LoaderFunction = async ({ request }): Promise<Response> => {
  const isAuthenticated = await authenticator.isAuthenticated(request);
  if (isAuthenticated) {
    return redirect('/app/episodes');
  }
  return redirect('/app/account');
};
