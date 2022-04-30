import {
  aggregateFeedsAndEpisodes,
  getFeedsSubscribedByUser,
  IGetFeedsSubscribedByUserData,
  toggleUserFeedSubscription,
} from '../../../services/core.server';
import { Form, useLoaderData } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { authenticator } from '../../../services/auth.server';
import { FeedList, FeedListLinks } from '@pdcstrrss/ui';
import styles from '../../../styles/AuthenticatedFeedsIndex.css';

interface AuthenticatedFeedsIndexLoaderResponse {
  feedsData: IGetFeedsSubscribedByUserData;
}

export function links() {
  return [...FeedListLinks(), { rel: 'stylesheet', href: styles }];
}

export const action: ActionFunction = async ({ request }) => {
  const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
  if (!userId) throw new Error('User not found');
  const formData = await request.formData();
  const selectedFeeds = formData.getAll('feeds') as string[];
  await toggleUserFeedSubscription({ feedIds: selectedFeeds, userId });
  return redirect('/feeds');
};

export const loader: LoaderFunction = async ({ request }): Promise<AuthenticatedFeedsIndexLoaderResponse> => {
  try {
    const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId) throw new Error('User not found');
    let feedsData = await getFeedsSubscribedByUser({ userId });
    if (!feedsData.feeds.length) {
      await aggregateFeedsAndEpisodes();
      feedsData = await getFeedsSubscribedByUser({ userId });
    }
    return { feedsData };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function AuthenticatedFeedsIndex() {
  const { feedsData } = useLoaderData<AuthenticatedFeedsIndexLoaderResponse>();

  return (
    <Form data-authenticated-feeds method="post">
      <FeedList feeds={feedsData.feeds} />
    </Form>
  );
}
