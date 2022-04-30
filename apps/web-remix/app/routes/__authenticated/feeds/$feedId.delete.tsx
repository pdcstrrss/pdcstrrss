import invariant from 'tiny-invariant';
import { Button, ButtonLinks } from '@pdcstrrss/ui';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { deleteFeedsOfUser, getFeedById } from '../../../services/core.server';
import { authenticator } from '../../../services/auth.server';
import { Feed } from '@pdcstrrss/database';

interface AuthenticatedFeedsDeleteLoaderResponse {
  feed: Feed;
}

export const links = () => [...ButtonLinks()];

export const action: ActionFunction = async ({ request, params }) => {
  try {
    invariant(params.feedId, 'Expected params.feedId');

    const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId) throw new Response(null, { status: 401 });

    const feed = await getFeedById(params.feedId, { userId });
    if (!feed) throw new Response(null, { status: 404 });

    await deleteFeedsOfUser({ userId, feedIds: [feed.id] });

    return redirect(`/feeds`);
  } catch (error: any) {
    throw new Response(error, { status: 400 });
  }
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<AuthenticatedFeedsDeleteLoaderResponse | Response> => {
  try {
    invariant(params.feedId, 'Expected params.feedId');

    const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId) throw new Response(null, { status: 401 });

    const feed = await getFeedById(params.feedId, { userId });
    if (!feed) throw new Response(null, { status: 404 });

    return { feed };
  } catch (error: any) {
    throw new Response(error, { status: 400 });
  }
};

export default function AuthenticatedFeedsDelete() {
  const { feed } = useLoaderData<AuthenticatedFeedsDeleteLoaderResponse>();
  return (
    <form method="post">
      <h1>Remove</h1>
      <div data-card data-clear-inner-space>
        <p>
          Are you sure you want to remove <strong>{feed?.title}</strong> from your list of feeds?
        </p>
        <p>This action will remove all episode data and preferences of this feed linked to your account.</p>
      </div>
      <div style={{ marginTop: 'var(--space)', display: 'flex', alignItems: 'center', gap: 'var(--space)' }}>
        <Button data-button-danger>Delete</Button>
        <Link to="/feeds">Cancel</Link>
      </div>
    </form>
  );
}
