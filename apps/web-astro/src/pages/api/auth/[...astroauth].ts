import AstroAuth from '@astro-auth/core';
import { GithubProvider } from '@astro-auth/providers';

export const all = AstroAuth({
  authProviders: [
    GithubProvider({
      clientId: import.meta.env.GH_OAUTH_CLIENT_ID || '',
      clientSecret: import.meta.env.GH_OAUTH_CLIENT_SECRET || '',
      scope: 'identify email',
    }),
  ],
  hooks: {},
});
