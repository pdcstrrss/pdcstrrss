import { Authenticator } from 'remix-auth';
import { OAuth2StrategyVerifyParams } from 'remix-auth-oauth2';
import { GitHubExtraParams, GitHubProfile, GitHubStrategy, GitHubStrategyOptions } from 'remix-auth-github';
import { sessionStorage } from './session.server';
import { upsertUserWithOAuthSession } from '@pdcstrrss/database';
import type { IAuthenticationCookie } from '@pdcstrrss/core';

const gitHubStrategyOptions: GitHubStrategyOptions = {
  clientID: process.env.GH_OAUTH_CLIENT_ID || '',
  clientSecret: process.env.GH_OAUTH_CLIENT_SECRET || '',
  callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
};

async function verifyCallBack({
  accessToken,
  refreshToken,
  profile,
}: OAuth2StrategyVerifyParams<GitHubProfile, GitHubExtraParams>): Promise<IAuthenticationCookie> {
  const email = profile.emails?.[0].value?.toUpperCase();
  const githubId = profile._json.login;

  if (!githubId) {
    throw new Error('No githubId for GitHub account found');
  }

  if (!email) {
    throw new Error('No email for GitHub account found');
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
    throw new Error('No user found');
  }

  return { id: user.id, accessToken };
}

export const authenticator = new Authenticator<IAuthenticationCookie>(sessionStorage);
const gitHubStrategy = new GitHubStrategy(gitHubStrategyOptions, verifyCallBack);
authenticator.use(gitHubStrategy);
