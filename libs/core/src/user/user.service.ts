import { db } from '@pdcstrrss/database';

export { getUserById } from '@pdcstrrss/database';

export interface IUserSponsorship {
  sponsor: boolean;
  member: boolean;
}

export interface IGetUserSponsorshipParams {
  accessToken: string;
}

const grapgqlRequest = async ({ query, accessToken }: { query: string; accessToken: string }) =>
  fetch('https://api.github.com/graphql', {
    body: JSON.stringify({ query }),
    method: 'POST',
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  }).then((res) => res.json());

export async function getUserSponsorship({ accessToken }: IGetUserSponsorshipParams): Promise<IUserSponsorship> {
  const query = `
      {
        organization(login: "pdcstrrss") {
          viewerIsAMember
          viewerIsSponsoring
        }
      }
    `;
  const data = await grapgqlRequest({ query, accessToken }).catch((ex) => {
    throw new Error('Failed to fetch user sponsorship data \n ' + ex);
  });

  if (data.errors) {
    throw new Error('Failed to fetch user sponsorship data \n ' + data.errors[0].message);
  }

  return {
    sponsor: !!data?.data?.organization?.viewerIsSponsoring,
    member: !!data?.data?.organization?.viewerIsAMember,
  };
}

export async function getUserInfo({ accessToken }: IGetUserSponsorshipParams): Promise<{ id: string }> {
  const query = `
    {
      viewer {
        login
        id
        databaseId
      }
    }
    `;
  const data = await grapgqlRequest({ query, accessToken }).catch((ex) => {
    throw new Error('Failed to fetch user info data \n ' + ex);
  });
  return {
    id: data?.data?.viewer?.login.toString(),
  };
}

export async function getUserByGitHubId(githubId: string) {
  const user = await db.user.findUnique({
    where: { githubId },
  });
  return user;
}
