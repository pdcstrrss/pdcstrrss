import { getUserSponsorship, getUserById, IUserSponsorship } from '../../../services/core.server';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { authenticator } from '../../../services/auth.server';
import type { User } from '@prisma/client';
import clsx from 'clsx';

interface AccountIndexLoaderResponse {
  user: User | null;
  sponsorship?: IUserSponsorship | null;
}

export const loader: LoaderFunction = async ({ request }): Promise<AccountIndexLoaderResponse> => {
  try {
    const { id: userId, accessToken } = (await authenticator.isAuthenticated(request)) || {};
    const user = userId ? await getUserById(userId) : null;
    const sponsorship = user && accessToken ? await getUserSponsorship({ accessToken }) : null;
    return { user, sponsorship };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function AccountIndex() {
  const { user, sponsorship } = useLoaderData<AccountIndexLoaderResponse>();
  const sponsorOrMember = sponsorship?.sponsor || sponsorship?.member;
  return (
    <div className="page container">
      <header className="page-header">
        <h1 className="page-header-title">{user ? 'Account' : 'Create an account'}</h1>
      </header>
      <div className="page-account-container">
        <div className={clsx('card clear-inner-space', { 'card-success': !!user })} inert={user ? 'true' : undefined}>
          <div className="card-header">
            <h2 className="h4">{user ? 'Logged in' : 'Login'}</h2>
          </div>
          <div className="card-body">
            {user ? (
              <p>
                Great! You've already logged in with GitHub. This way you can add 3 RSS podcast feeds and listen to the
                episodes.
              </p>
            ) : (
              <p>Login with GitHub to add 3 RSS podcast feeds.</p>
            )}
          </div>
          <div className="card-footer">
            <a className={clsx('button', { 'button-success disabled': !!user })} href="/login">
              <svg>
                <use xlinkHref={user ? '#check' : '#github'} />
              </svg>
              {user ? 'Logged in' : 'Login'} with GitHub
            </a>
          </div>
          <div className="card-badge">
            {user ? (
              <svg className="card-badge-icon">
                <use xlinkHref="#check" />
              </svg>
            ) : (
              <div className="card-badge-text">1</div>
            )}
          </div>
        </div>
        <div
          className={clsx('card clear-inner-space', { 'card-success': sponsorOrMember })}
          inert={sponsorOrMember ? 'true' : undefined}
        >
          <div className="card-header">
            <h2 className="h4">Sponsor</h2>
          </div>
          <div className="card-body">
            {sponsorOrMember ? (
              <p>Thank you for sponsoring PDCSTRRSS! With your support, we can keep our servers running.</p>
            ) : (
              <p>
                Support PDCSTRRSS, starting at only <strong>$2 / month</strong> via GitHub sponsors, and add{' '}
                <strong>unlimited</strong> RSS podcast feeds.
              </p>
            )}
          </div>
          <div className="card-footer">
            <a
              className={clsx('button', {
                'button-success': sponsorOrMember,
                'button-fuchsia': !sponsorOrMember,
                disabled: user && sponsorOrMember,
              })}
              href="/login"
            >
              <svg>
                <use xlinkHref={sponsorOrMember ? '#check' : '#heart'} />
              </svg>
              Sponsor{user ? 'ing' : ''} via GitHub
            </a>
          </div>
          <div className="card-badge">
            {sponsorOrMember ? (
              <svg className="card-badge-icon">
                <use xlinkHref="#check" />
              </svg>
            ) : (
              <div className="card-badge-text">2</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
