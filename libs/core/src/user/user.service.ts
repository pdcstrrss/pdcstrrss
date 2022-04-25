import pMap from 'p-map';
import { deleteUserById, getAllUsers, getUserById } from '@pdcstrrss/database';
import { IAuthenticationCookie } from '..';
import pSettle from 'p-settle';

export interface IGetUserSponsorshipParams {
  githubId: string;
  accessToken: string;
}

interface IInitializeUserByRequestParams {
  getAuthenticationCookie: Promise<IAuthenticationCookie | null>;
}

export async function getUserSponsorship({ githubId, accessToken }: IGetUserSponsorshipParams) {
  const body = JSON.stringify({
    query: `
      {
        user(login: "${githubId}") {
          isSponsoredBy(accountLogin: "pdcstrrss")
          contributionsCollection(organizationID: "O_kgDOBfNDuw") {
            hasAnyContributions
          }
        }
      }
    `,
  });

  const data = await fetch('https://api.github.com/graphql', {
    body,
    method: 'POST',
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch((ex) => {
      throw new Error('Failed to fetch user sponsorship data \n ' + ex);
    });

  return {
    sponsor: !!data?.data?.user?.isSponsoredBy,
    contributor: !!data?.data?.user?.contributionsCollection?.hasAnyContributions,
  };
}

export async function initializeUserByRequest({ getAuthenticationCookie }: IInitializeUserByRequestParams) {
  const { id, accessToken } = (await getAuthenticationCookie) || {};
  if (!id || !accessToken) return null;
  const user = await getUserById(id);
  if (!user) return null;
  const userSponsorship = await getUserSponsorship({
    githubId: user.githubId,
    accessToken: accessToken,
  });
  return { user, userSponsorship };
}

export interface ICleanupUsersParams {
  accessToken: string;
}

export async function cleanupUsers({ accessToken }: ICleanupUsersParams) {
  const allUsers = await getAllUsers();
  const usersToBeDeleted = await pMap(
    allUsers,
    async (user) => {
      const { sponsor, contributor } = await getUserSponsorship({
        githubId: user.githubId,
        accessToken: accessToken,
      });
      return {
        ...user,
        sponsor,
        contributor,
      };
    },
    { concurrency: 25 }
  ).then((users) => users.filter(({ sponsor, contributor }) => !sponsor && !contributor));

  const results = await pSettle(
    usersToBeDeleted.map(({ id }) => deleteUserById(id)),
    { concurrency: 25 }
  );

  const errors = results.filter(({ isRejected }) => isRejected);
  if (errors.length) {
    throw new Error("Failed to cleanup users that aren't sponsored or contributors \n " + errors);
  }
}
