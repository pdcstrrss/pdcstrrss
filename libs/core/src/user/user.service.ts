export { getUserById } from '@pdcstrrss/database';

export interface IUserSponsorship {
  sponsor: boolean;
  member: boolean;
}

export interface IGetUserSponsorshipParams {
  accessToken?: string | null;
}

const graphQlRequest = async ({ query, accessToken }: { query: string; accessToken: string }) =>
  fetch('https://api.github.com/graphql', {
    body: JSON.stringify({ query }),
    method: 'POST',
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  }).then((res) => res.json());

export async function getUserSponsorship({ accessToken }: IGetUserSponsorshipParams): Promise<IUserSponsorship> {
  if (!accessToken) {
    return {
      sponsor: false,
      member: false,
    };
  }

  const query = `
      {
        organization(login: "pdcstrrss") {
          viewerIsAMember
          viewerIsSponsoring
        }
      }
    `;
  const data = await graphQlRequest({ query, accessToken }).catch((ex) => {
    throw new Error('Failed to fetch user sponsorship data \n ' + ex);
  });

  if (data.message) throw new Error('Failed to fetch user sponsorship data \n ' + data.message);
  if (data.errors) throw new Error('Failed to fetch user sponsorship data \n ' + data.errors[0]?.message);

  return {
    sponsor: !!data?.data?.organization?.viewerIsSponsoring,
    member: !!data?.data?.organization?.viewerIsAMember,
  };
}

export async function getUserInfo({ accessToken }: IGetUserSponsorshipParams): Promise<{ id: string } | undefined> {
  if (!accessToken) return;

  const query = `
    {
      viewer {
        login
        id
        databaseId
      }
    }`;
  const data = await graphQlRequest({ query, accessToken }).catch((ex) => {
    throw new Error('Failed to fetch user info data \n ' + ex);
  });
  return {
    id: data?.data?.viewer?.login.toString(),
  };
}
