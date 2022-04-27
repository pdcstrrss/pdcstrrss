import {
  aggregateFeedsAndEpisodes,
  assignFeedsToUser,
  getFeedsSubscribedByUser,
  IGetFeedsSubscribedByUserData,
} from '../../../services/core.server';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { authenticator } from '../../../services/auth.server';
import { Button, FeedList, FeedListLinks } from '@pdcstrrss/ui';

interface UserFeedsIndexLoaderResponse {
  feedsData: IGetFeedsSubscribedByUserData;
}

export function links() {
  return [...FeedListLinks()];
}

export const action: ActionFunction = async ({ request }) => {
  const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
  if (!userId) throw new Error('User not found');

  const formData = await request.formData();
  const selectedFeeds = formData.getAll('feeds') as string[];

  await assignFeedsToUser({ feedIds: selectedFeeds, userId });

  return redirect('/feeds');
};

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
  const errors = useActionData();
  console.error(errors);
  return (
    <Form style={{ paddingBlock: 'var(--space)' }} method="post">
      <FeedList feeds={data.feeds} />
      <div style={{ paddingBlockStart: 'var(--space)' }}>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}
