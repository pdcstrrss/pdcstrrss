import { NavLink, Link } from '@remix-run/react';
import { User } from '@pdcstrrss/database';
import styles from './AppHeader.css';
import type { To } from 'history';
import clsx from 'clsx';
import { TRANSLATIONS } from '../../../constants';

export const AppHeaderLinks = () => [{ rel: 'stylesheet', href: styles }];

export type AppHeaderUser = Pick<User, 'displayName' | 'image'>;
export type AppHeaderNavLinks = { title: string; to: To }[];

export interface IAppHeaderProps {
  user?: AppHeaderUser;
  inverted?: boolean;
}

const navLinks = [
  {
    title: TRANSLATIONS.episodes,
    to: '/app/episodes',
  },
  {
    title: TRANSLATIONS.feeds,
    to: '/app/feeds',
  },
];

export function AppHeader(props: IAppHeaderProps) {
  const { user, inverted } = props;

  return (
    <header className={clsx('app-header container', { 'app-header-inverted': inverted })}>
      <div className="app-header-logo">
        <Link to="/" className="logo">
          <svg className="logo-icon" role="presentation">
            <use xlinkHref="#logo" />
          </svg>
          <div className="logo-text">{TRANSLATIONS.title}</div>
        </Link>
      </div>
      <nav className="app-header-nav">
        {user ? (
          navLinks &&
          navLinks.map(({ title, to }) => (
            <NavLink
              key={title}
              className={({ isActive }) => clsx({ active: isActive }, 'app-header-nav-link')}
              to={to}
            >
              {title}
            </NavLink>
          ))
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

      {user?.image && <img className="app-header-image" src={user.image} alt={user.displayName} />}
    </header>
  );
}
