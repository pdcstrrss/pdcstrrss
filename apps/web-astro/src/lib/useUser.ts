import { getUser } from '@astro-auth/core';
import { getUserByGitHubId } from 'libs/core/src';
import type { UserSession } from './useUserTypes';

export const getUserSessionFromRequest = ({ request }: { request: Request }): UserSession | null =>
  getUser({ server: request });

export async function getUserFromRequest({ request }: { request: Request }) {
  const userSession = getUserSessionFromRequest({ request });
  if (!userSession) return null;
  const user = await getUserByGitHubId(userSession.user.id);
  return user;
}
