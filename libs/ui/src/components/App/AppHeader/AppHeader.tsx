import type { MouseEventHandler } from 'react';
import type { User } from '@prisma/client';
import clsx from 'clsx';
import { TRANSLATIONS } from '../../../constants';
import { Dropdown } from '../../Dropdown/Dropdown';

export type AppHeaderUser = Partial<Pick<User, 'name' | 'image' | 'id'>>;
export type AppHeaderNavLinks = { title: string; to?: string; callback?: MouseEventHandler<HTMLButtonElement> }[];

export interface IAppHeaderProps {
  user?: AppHeaderUser | null | undefined;
  inverted?: boolean;
  currentPath: string;
  loginButton?: React.ElementType;
}

function isActiveNavLink(currentPath: string, to?: string) {
  return to?.startsWith(currentPath);
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
    to: '/app/logout',
  },
];

function renderNavLinks(navLinks: AppHeaderNavLinks, currentPath: string) {
  return navLinks.map(({ title, to, callback }) => {
    if (callback) {
      return (
        <button key={title} className={clsx('app-header-nav-link')} onClick={callback} type="button">
          {title}
        </button>
      );
    }

    return (
      <a key={title} className={clsx('app-header-nav-link', { active: isActiveNavLink(currentPath, to) })} href={to}>
        {title}
      </a>
    );
  });
}

export function AppHeader(props: IAppHeaderProps) {
  const { user, inverted, currentPath, loginButton } = props;

  return (
    <header className={clsx('app-header container', { 'app-header-inverted': inverted })}>
      <div className="app-header-logo">
        <a href="/" className="logo" aria-labelledby="appHeaderLogoText">
          <svg className="logo-icon" role="presentation">
            <use xlinkHref="#logo" />
          </svg>
          <div id="appHeaderLogoText" className="logo-text">
            {TRANSLATIONS.title}
          </div>
        </a>
      </div>
      <nav className="app-header-nav">
        {user ? (
          navLinks && renderNavLinks(navLinks, currentPath)
        ) : (
          <>
            {loginButton}
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
            <button
              type="button"
              className="button-reset"
              aria-label={`Click to ${visibility ? 'close' : 'open'} account options`}
            >
              {user?.image && (
                <img
                  className="app-header-image"
                  src={user.image}
                  alt={user.name || user.id}
                  width="100px"
                  height="100px"
                />
              )}
            </button>
          )}
        >
          {renderNavLinks(dropdownLinks, currentPath)}
        </Dropdown>
      )}
    </header>
  );
}
