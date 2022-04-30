import {
  getFeedsOfUser,
  IGetFeedsOfUserData,
} from '../../../services/core.server';
import { Link, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { authenticator } from '../../../services/auth.server';
import { FeedList, FeedListLinks } from '@pdcstrrss/ui';
import styles from '../../../styles/AuthenticatedFeedsIndex.css';

interface AuthenticatedFeedsIndexLoaderResponse {
  feedsData: IGetFeedsOfUserData;
}

export function links() {
  return [...FeedListLinks(), { rel: 'stylesheet', href: styles }];
}

export const loader: LoaderFunction = async ({ request }): Promise<AuthenticatedFeedsIndexLoaderResponse> => {
  try {
    const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId) throw new Error('User not found');
    const feedsData = await getFeedsOfUser({ userId });
    return { feedsData };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function AuthenticatedFeedsIndex() {
  const { feedsData } = useLoaderData<AuthenticatedFeedsIndexLoaderResponse>();

  return (
    <div data-authenticated-feeds>
      <header data-page-header>
        <h1 data-page-title>Feeds</h1>
        <div data-page-actions>
          <Link data-button data-button-primary to="create">
            <span>Add feed</span>
          </Link>
        </div>
      </header>

      {feedsData.feeds.length ? <FeedList feeds={feedsData.feeds} /> : <div data-card>No feeds found</div>}
    </div>
  );
}
