export { getUserById } from '@pdcstrrss/database';

export interface IUserSponsorship {
  sponsor: boolean;
  member: boolean;
}

export interface IGetUserSponsorshipParams {
  accessToken: string;
}

export async function getUserSponsorship({ accessToken }: IGetUserSponsorshipParams): Promise<IUserSponsorship> {
  const body = JSON.stringify({
    query: `
      {
        organization(login: "pdcstrrss") {
          viewerIsAMember
          viewerIsSponsoring
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

  console.log(data);

  return {
    sponsor: !!data?.data?.organization?.viewerIsSponsoring,
    member: !!data?.data?.organization?.viewerIsAMember,
  };
}
