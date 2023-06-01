import GitHub from '@auth/core/providers/github';
import type { AuthConfig } from '@auth/core';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@pdcstrrss/database';

const config: AuthConfig = {
  //@ts-expect-error issue
  adapter: PrismaAdapter(db),
  providers: [
    //@ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
    GitHub({
      clientId: import.meta.env.GH_OAUTH_CLIENT_ID,
      clientSecret: import.meta.env.GH_OAUTH_CLIENT_SECRET,
      authorization: {
        params: { scope: 'read:user user:email read:org' },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          githubId: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
};

export default config;
