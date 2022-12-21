import type { User, Episode } from '@prisma/client';
import { getUser } from '@astro-auth/core';
import { getUserByGitHubId, getEpisodeWithStatusPlaying } from '@pdcstrrss/core';
import type { UserSession } from './useUserTypes';
import type { AstroGlobal } from 'astro';

export const getUserSessionFromRequest = ({ request }: { request: Request }): UserSession | null =>
  getUser({ server: request });

export type UserFromRequest = User & {
  activeEpisode: Episode | null;
};

export async function getUserFromRequest({ request }: Readonly<AstroGlobal<Record<string, any>>>) {
  const userSession = getUserSessionFromRequest({ request });
  if (!userSession) return;
  const user = await getUserByGitHubId(userSession.user.id);
  if (!user) return;
  const activeUserEpisode = await getEpisodeWithStatusPlaying(user?.id);
  return {
    ...user,
    activeEpisode: activeUserEpisode,
  } as UserFromRequest;
}
