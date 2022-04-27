import {
  aggregateFeedsAndEpisodes,
  getFeedsSubscribedByUser,
  IGetFeedsSubscribedByUserData,
} from '../../services/core.server';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { authenticator } from '../../services/auth.server';
import { FeedList, FeedListLinks } from '@pdcstrrss/ui';

interface UserFeedsIndexLoaderResponse {
  feedsData: IGetFeedsSubscribedByUserData;
}

export function links() {
  return [...FeedListLinks()];
}

export const loader: LoaderFunction = async ({ request }): Promise<UserFeedsIndexLoaderResponse> => {
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

export default function UserFeedsIndex() {
  const { feedsData: data } = useLoaderData<UserFeedsIndexLoaderResponse>();
  return <FeedList feeds={data.feeds} />;
}
