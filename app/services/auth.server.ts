import { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { sessionStorage } from "~/services/session.server";
import { db } from "./database.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<string>(sessionStorage);

let gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GH_OAUTH_CLIENT_ID || "",
    clientSecret: process.env.GH_OAUTH_CLIENT_SECRET || "",
    callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
  },
  async ({ accessToken, extraParams, profile }) => {
    const email = profile.emails?.[0].value?.toUpperCase();
    const githubId = profile.id;

    if (!githubId) {
      throw new Error("No githubId for GitHub account found");
    }

    if (!email) {
      throw new Error("No email for GitHub account found");
    }

    const newData: Pick<User, 'email' | 'githubId' | 'image' | 'name'> = {
      githubId,
      email,
      image: profile.photos?.[0].value,
      name: profile.displayName,
    }

    const user = await db.user.upsert({
      where: {
        githubId,
      },
      update: newData,
      create: newData,
    });

    return user.id;
  }
);

authenticator.use(gitHubStrategy);
