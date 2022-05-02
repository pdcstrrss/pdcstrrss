import isUrl from 'validator/lib/isUrl';
import { Button, ButtonLinks } from '@pdcstrrss/ui';
import { Link, useActionData, useTransition } from '@remix-run/react';
import { ActionFunction, redirect } from '@remix-run/server-runtime';
import { addFeedsToUser, createFeedByUrl, getFeedByUrl } from '../../../services/core.server';
import { authenticator } from '../../../services/auth.server';

export const links = () => [...ButtonLinks()];

export const action: ActionFunction = async ({ request }) => {
  const { id: userId } = (await authenticator.isAuthenticated(request)) || {};
  if (!userId) throw new Error('User not found');
  const formData = await request.formData();
  const url = formData.get('url')?.toString();

  if (!url || !isUrl(url)) {
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

export default function AuthenticatedFeedsDelete() {
  const error = useActionData();
  const transition = useTransition();
  return (
    <div>
      <header data-page-header>
        <h1 data-page-title>Add feed</h1>
      </header>
      <form method="post">
        {error && (
          <div data-alert data-alert-danger>
            {error}
          </div>
        )}
        <div data-card data-clear-inner-space>
          <label htmlFor="url">Url</label>
          <input id="url" type="url" name="url" required placeholder="https://example.com/feed" />
        </div>
        <div style={{ marginTop: 'var(--space)', display: 'flex', alignItems: 'center', gap: 'var(--space)' }}>
          <Button type="submit" data-button-primary disabled={!!transition.submission}>
            {transition.submission ? 'Adding feed...' : 'Add feed'}
          </Button>
          <Link to="/feeds">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
