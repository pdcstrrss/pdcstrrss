import { Authenticator } from "remix-auth";
import { OAuth2StrategyVerifyParams } from "remix-auth-oauth2";
import { GitHubExtraParams, GitHubProfile, GitHubStrategy, GitHubStrategyOptions } from "remix-auth-github";
import { sessionStorage } from "~/services/session.server";
import {
  getById as getUserById,
  upsertWithOAuthSession as upsertUserWithOAuthSession,
} from "~/repositories/user.repository";

const gitHubStrategyOptions: GitHubStrategyOptions = {
  clientID: process.env.GH_OAUTH_CLIENT_ID || "",
  clientSecret: process.env.GH_OAUTH_CLIENT_SECRET || "",
  callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
};

async function verifyCallBack({
  accessToken,
  refreshToken,
  extraParams,
  profile,
  context,
}: OAuth2StrategyVerifyParams<GitHubProfile, GitHubExtraParams>): Promise<string> {
  const email = profile.emails?.[0].value?.toUpperCase();
  const githubId = profile.id;

  if (!githubId) {
    throw new Error("No githubId for GitHub account found");
  }

  if (!email) {
    throw new Error("No email for GitHub account found");
  }

  const user = await upsertUserWithOAuthSession({
    githubId,
    email,
    image: profile.photos?.[0].value,
    displayName: profile.displayName,
    accessToken,
    refreshToken,
  });

  if (!user) {
    throw new Error("No user found");
  }
  
  return user.id;
}

export const authenticator = new Authenticator<string>(sessionStorage);
const gitHubStrategy = new GitHubStrategy(gitHubStrategyOptions, verifyCallBack);
authenticator.use(gitHubStrategy);

export async function getUser({ request }: { request: Request }) {
  const userId = await authenticator.isAuthenticated(request);
  if (!userId) return null;
  return getUserById(userId);
}
