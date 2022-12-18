import { getUser } from '@astro-auth/core';
import { getUserByGitHubId, getEpisodeWithStatusPlaying } from '@pdcstrrss/core';
import type { UserSession } from './useUserTypes';

export const getUserSessionFromRequest = ({ request }: { request: Request }): UserSession | null =>
  getUser({ server: request });

export async function getUserFromRequest({ request }: { request: Request }) {
  const userSession = getUserSessionFromRequest({ request });
  if (!userSession) return null;
  const user = await getUserByGitHubId(userSession.user.id);
  const activeUserEpisode = await getEpisodeWithStatusPlaying(user?.id);
  return {
    ...user,
    activeEpisode: activeUserEpisode,
  };
}
