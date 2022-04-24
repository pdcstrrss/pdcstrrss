export interface IGetUserSponsorshipParams {
  githubId: string;
  accessToken: string;
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

    console.log(data);

  return {
    sponsor: !!data?.data?.user?.isSponsoredBy,
    contributer: !!data?.data?.user?.contributionsCollection?.hasAnyContributions,
  };
}
