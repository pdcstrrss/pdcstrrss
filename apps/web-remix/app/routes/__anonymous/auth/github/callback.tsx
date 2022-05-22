import { LoaderFunction, redirect } from '@remix-run/server-runtime';
import { redirectCookie } from '../../../../services/cookie.server';
import { authenticator } from '../../../../services/auth.server';
import { commitSession, getSession } from '../../../../services/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await authenticator.authenticate('github', request, {
    failureRedirect: '/',
  });
  const cookieHeader = request.headers.get('Cookie');

  // manually get the session
  const session = await getSession(cookieHeader);
  // and store the user data
  session.set(authenticator.sessionKey, userSession);

  // commit the session
  const headers = new Headers({ 'Set-Cookie': await commitSession(session) });

  // redirect the user
  const redirectPath: string | null = (await redirectCookie.parse(cookieHeader)) || null;
  if (redirectPath) {
    headers.append('Set-Cookie', await redirectCookie.serialize(undefined));
  }
  return redirect(redirectPath || '/app/episodes', { headers });
};
