import { authenticator } from '../../services/auth.server';
import { LoginView } from '@pdcstrrss/ui';
import { LoaderFunction } from '@remix-run/server-runtime';

export const loader: LoaderFunction = async ({ request }): Promise<null> => {
  return authenticator.isAuthenticated(request, {
    successRedirect: '/app',
  });
};

export default function Login() {
  return <LoginView />;
}
