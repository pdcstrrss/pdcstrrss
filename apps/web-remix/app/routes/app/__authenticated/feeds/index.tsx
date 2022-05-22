import {
  exceedsFreeFeedThreshold,
  getFeedsOfUser,
  getUserSponsorship,
  IGetFeedsOfUserData,
  getUserById,
} from '../../../../services/core.server';
import { Link, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { authenticator } from '../../../../services/auth.server';
import { FeedList, FeedListLinks } from '@pdcstrrss/ui';

interface AuthenticatedFeedsIndexLoaderResponse {
  feedsData: IGetFeedsOfUserData;
  canCreateFeed: boolean;
}

export function links() {
  return [...FeedListLinks()];
}

export const loader: LoaderFunction = async ({ request }): Promise<AuthenticatedFeedsIndexLoaderResponse> => {
  try {
    const { id: userId, accessToken } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId || !accessToken) throw new Response('User not authenticated', { status: 401 });

    const user = await getUserById(userId);
    if (!user) throw new Response('User not found', { status: 400 });

    const sponsorship = await getUserSponsorship({ githubId: user.githubId, accessToken });
    const canCreateFreeFeeds = await exceedsFreeFeedThreshold({ userId });
    const canCreateFeed = canCreateFreeFeeds || sponsorship.sponsor || sponsorship.contributor;
    const feedsData = await getFeedsOfUser({ userId });
    return { feedsData, canCreateFeed };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function AuthenticatedFeedsIndex() {
  const { feedsData, canCreateFeed } = useLoaderData<AuthenticatedFeedsIndexLoaderResponse>();
  return (
    <>
      <header className='page-header'>
        <h1 className='page-header-title'>Feeds</h1>
        <div className='page-header-action'>
          {canCreateFeed ? (
            <Link className='button button-primary' to="create">
              <span>Add feed</span>
            </Link>
          ) : (
            <Link to="/account">Want to add more feeds?</Link>
          )}
        </div>
      </header>
      {feedsData.feeds.length ? <FeedList feeds={feedsData.feeds} /> : <div data-card>No feeds found</div>}
    </>
  );
}
