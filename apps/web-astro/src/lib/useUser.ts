import { getUser } from '@astro-auth/core';
import { getUserByGitHubId, getUserInfo } from 'libs/core/src';
import type { UserSession } from './useUserTypes';

export async function getUserFromRequest({ request }: { request: Request }) {
  const userSession = (getUser({ server: request }) as UserSession | null) || null;
  if (!userSession) return null;
  const user = await getUserByGitHubId(userSession.user.id);
  return user;
}
