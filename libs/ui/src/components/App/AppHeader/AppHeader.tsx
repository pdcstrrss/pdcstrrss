import { NavLink, Link } from '@remix-run/react';
import { User } from '@pdcstrrss/database';
import type { To } from 'history';
import clsx from 'clsx';
import { TRANSLATIONS } from '../../../constants';
import Dropdown from '../../Dropdown/Dropdown';

export type AppHeaderUser = Pick<User, 'displayName' | 'image'>;
export type AppHeaderNavLinks = { title: string; to: To }[];

export interface IAppHeaderProps {
  user?: AppHeaderUser;
  inverted?: boolean;
}

const navLinks: AppHeaderNavLinks = [
  {
    title: TRANSLATIONS.episodes,
    to: '/app/episodes',
  },
  {
    title: TRANSLATIONS.feeds,
    to: '/app/feeds',
  },
];

const dropdownLinks: AppHeaderNavLinks = [
  {
    title: TRANSLATIONS.account,
    to: '/app/account',
  },
  {
    title: TRANSLATIONS.logout,
    to: '/logout',
  },
];

function renderNavLinks(navLinks: AppHeaderNavLinks) {
  return navLinks.map(({ title, to }) => (
    <NavLink key={title} className={({ isActive }) => clsx({ active: isActive }, 'app-header-nav-link')} to={to}>
      {title}
    </NavLink>
  ));
}

export function AppHeader(props: IAppHeaderProps) {
  const { user, inverted } = props;

  return (
    <header className={clsx('app-header container', { 'app-header-inverted': inverted })}>
      <div className="app-header-logo">
        <Link to="/" className="logo" aria-labelledby="appHeaderLogoText">
          <svg className="logo-icon" role="presentation">
            <use xlinkHref="#logo" />
          </svg>
          <div id="appHeaderLogoText" className="logo-text">
            {TRANSLATIONS.title}
          </div>
        </Link>
      </div>
      <nav className="app-header-nav">
        {user ? (
          navLinks && renderNavLinks(navLinks)
        ) : (
          <>
            <Link className="app-header-nav-link" to="/login">
              {TRANSLATIONS.login}
            </Link>
            <a
              href="https://github.com/pdcstrrss"
              target="_blank"
              rel="noreferrer"
              className="app-header-nav-link link-icon"
            >
              <svg className="app-header-nav-icon" aria-label={TRANSLATIONS.github}>
                <use xlinkHref="#github" />
              </svg>
            </a>
          </>
        )}
      </nav>
      {user && (
        <Dropdown
          toggle={({ visibility }) => (
            <button type='button' className="button-reset" aria-label={`Click to ${visibility ? 'close' : 'open'} account options`}>
              {user?.image && <img className="app-header-image" src={user.image} alt={user.displayName} width='100px' height='100px' />}
            </button>
          )}
        >
          {renderNavLinks(dropdownLinks)}
        </Dropdown>
      )}
    </header>
  );
}
