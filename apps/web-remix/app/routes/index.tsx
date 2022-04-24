import { authenticator } from '../services/auth.server';
import { IndexView, IndexViewLinks } from '@pdcstrrss/ui';
import { LoaderFunction } from '@remix-run/server-runtime';

export const loader: LoaderFunction = async ({ request }): Promise<null> => {
  return authenticator.isAuthenticated(request, {
    successRedirect: '/episodes',
  });
};

export const links = () => [...IndexViewLinks()];

export default function Index() {
  return <IndexView />;
}
