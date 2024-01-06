import GitHub from '@auth/core/providers/github';
import type { AuthConfig } from '@auth/core';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@pdcstrrss/database';

const config: AuthConfig = {
  secret: import.meta.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      allowDangerousEmailAccountLinking: true,
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
