import { authenticator } from '../../services/auth.server';
import { LoaderFunction } from '@remix-run/server-runtime';

export const loader: LoaderFunction = async ({ request }) => {
  return authenticator.logout(request, { redirectTo: '/' });
};
