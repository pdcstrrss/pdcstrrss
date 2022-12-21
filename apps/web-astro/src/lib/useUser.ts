import type { User, Episode } from '@prisma/client';
import { getUser } from '@astro-auth/core';
import {
  getUserByGitHubId,
  getEpisodeWithStatusPlaying,
  getUserSponsorship,
  exceedsFreeFeedThreshold,
} from '@pdcstrrss/core';
import type { UserSession } from './useUserTypes';
import type { AstroGlobal } from 'astro';

export const getUserSessionFromRequest = ({ request }: { request: Request }): UserSession | null =>
  getUser({ server: request });

export type UserFromRequest = User & {
  activeEpisode: Episode | null;
  permissions: {
    canCreateFeed: boolean;
    canCreateFreeFeeds: boolean;
  };
};

export async function getUserPermissions({ user, userSession }: { user: User; userSession: UserSession }) {
  const sponsorship = await getUserSponsorship({ accessToken: userSession.accessToken });
  const canCreateFreeFeeds = await exceedsFreeFeedThreshold({ userId: user?.id });
  const canCreateFeed = canCreateFreeFeeds || sponsorship.sponsor || sponsorship.member;
  return {
    canCreateFeed,
    canCreateFreeFeeds,
  };
}

export async function getUserFromRequest({ request }: Readonly<AstroGlobal<Record<string, any>>>) {
  const userSession = getUserSessionFromRequest({ request });
  if (!userSession) return;
  const user = await getUserByGitHubId(userSession.user.id);
  if (!user) return;
  const activeEpisode = await getEpisodeWithStatusPlaying(user?.id);
  const permissions = await getUserPermissions({ user, userSession });

  return {
    ...user,
    activeEpisode,
    permissions,
  } as UserFromRequest;
}
