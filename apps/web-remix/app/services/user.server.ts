import { getUserSponsorship } from '@pdcstrrss/core';
import { getUserById } from '@pdcstrrss/database';
import { authenticator } from './auth.server';

export async function initializeUserByRequest({ request }: { request: Request }) {
  const { id, accessToken } = (await authenticator.isAuthenticated(request)) || {};
  if (!id || !accessToken) return null;
  const user = await getUserById(id);
  if (!user) return null;
  const userSponsorship = await getUserSponsorship({
    githubId: user.githubId,
    accessToken: accessToken,
  });
  return { user, userSponsorship };
}
