import validator from 'validator';
import { Link, useActionData, useTransition } from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/server-runtime';
import {
  addFeedsToUser,
  createFeedByUrl,
  exceedsFreeFeedThreshold,
  getFeedByUrl,
  getUserById,
  getUserSponsorship,
} from '../../../../services/core.server';
import { authenticator } from '../../../../services/auth.server';

export const action: ActionFunction = async ({ request }) => {
  const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
  if (!userId) throw new Error('User not found');
  const formData = await request.formData();
  const url = formData.get('url')?.toString();

  if (!url || !validator.isURL(url)) {
    throw new Response(null, { status: 400 });
  }

  let feed = await getFeedByUrl(url, { userId });
  if (!feed) {
    feed = await createFeedByUrl(url);
  }

  if (!feed) {
    return new Response('New feed could not be retrieved', { status: 400 });
  }

  await addFeedsToUser({ userId, feedIds: [feed.id] });

  return redirect(`/feeds`);
};

export const loader: LoaderFunction = async ({ request }): Promise<Response> => {
  try {
    const { id: userId, accessToken } = (await authenticator.isAuthenticated(request)) || {};
    if (!userId || !accessToken) throw new Response('User not authenticated', { status: 401 });

    const user = await getUserById(userId);
    if (!user) throw new Response('User not found', { status: 400 });

    const sponsorship = await getUserSponsorship({ githubId: user.githubId, accessToken });
    const canCreateFreeFeeds = await exceedsFreeFeedThreshold({ userId });
    const canCreateFeed = canCreateFreeFeeds || sponsorship.sponsor || sponsorship.contributor;
    if (!canCreateFeed) {
      throw new Response('User not authorized', { status: 403 });
    }

    return new Response(null, { status: 200 });
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function AuthenticatedFeedsCreate() {
  const error = useActionData();
  const transition = useTransition();
  return (
    <div className="page container container-md">
      <header className="page-header">
        <h1 className="page-header-title">Add feed</h1>
      </header>
      <form method="post">
        {error && (
          <div data-alert data-alert-danger>
            {error}
          </div>
        )}
        <div className="clear-inner-space">
          <label htmlFor="url">Url</label>
          <input id="url" type="url" name="url" required placeholder="https://example.com/feed" />
        </div>
        <div
          style={{ marginTop: 'var(--space)', display: 'flex', alignItems: 'center', gap: 'calc(var(--space) / 2)' }}
        >
          <button className="button button-primary" type="submit" disabled={!!transition.submission}>
            {transition.submission ? 'Adding feed...' : 'Add feed'}
          </button>
          <Link className="button button-link" to="/app/feeds">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
