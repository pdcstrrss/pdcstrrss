import type { User } from '@prisma/client';
import { getSession } from 'auth-astro/server';
import {
  getEpisodeWithStatusPlaying,
  getUserSponsorship,
  exceedsFreeFeedThreshold,
  getUserById,
} from '@pdcstrrss/core';
import type { Session } from '@auth/core';

export const getUserSessionFromRequest = ({ request }: { request: Request }) =>
  getSession(request) as Promise<Session | null>;

export async function getUserPermissions({ userId, accessToken }: { userId: string; accessToken?: string }) {
  const sponsorship = await getUserSponsorship({ accessToken });
  const canCreateFreeFeeds = await exceedsFreeFeedThreshold({ userId });
  const canCreateFeed = canCreateFreeFeeds || sponsorship.sponsor || sponsorship.member;
  return {
    canCreateFeed,
    canCreateFreeFeeds,
  };
}

export async function getUserFromRequest({ request }: { request: Request }) {
  const userSession = await getUserSessionFromRequest({ request });
  if (!userSession) return;
  const user = await getUserById(userSession.user.id);
  if (!user) return;
  const activeEpisode = await getEpisodeWithStatusPlaying(user.id);
  const { access_token: gitHubAccessToken } = (await getUserAccountByProvider({ provider: 'github', user })) || {};
  const permissions = await getUserPermissions({ userId: user.id, accessToken: gitHubAccessToken });

  return {
    ...user,
    activeEpisode,
    permissions,
  };
}

export async function getUserAccountByProvider({
  provider,
  user,
}: {
  provider: string;
  user:
    | (User & {
        accounts: {
          provider: string;
          providerAccountId: string;
          access_token: string | null;
        }[];
      })
    | undefined;
}) {
  return user?.accounts.find((account) => account.provider === provider);
}
