import AstroAuth from '@astro-auth/core';
import { GithubProvider } from '@astro-auth/providers';
import { upsertUser } from '@pdcstrrss/database';
import type { UserSession } from '../../../lib/useUserTypes';

export const all = AstroAuth({
  authProviders: [
    GithubProvider({
      clientId: import.meta.env.GH_OAUTH_CLIENT_ID || '',
      clientSecret: import.meta.env.GH_OAUTH_CLIENT_SECRET || '',
      scope: 'identify email',
    }),
  ],
  hooks: {
    // signIn hook has a argument with all the user info
    signIn: async (userSession: UserSession | null) => {
      if (!userSession) return false;
      try {
        const response = await upsertUser({
          githubId: userSession.user.id,
          email: userSession.user.email,
          image: userSession.user.image,
          displayName: userSession.user.name,
        });
        return !!response;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
});
