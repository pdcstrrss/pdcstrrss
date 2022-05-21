import { Link } from '@remix-run/react';
import clsx from 'clsx';
import { TRANSLATIONS } from '../../../constants';

export function AppFooter() {
  return (
    <footer className={clsx('app-footer container')}>
      <div className="app-footer-logo">
        <Link to="/" className="logo">
          <svg className="logo-icon" role="presentation">
            <use xlinkHref="#logo" />
          </svg>
          <div className="logo-text">{TRANSLATIONS.title}</div>
        </Link>
      </div>

      <a href="https://github.com/pdcstrrss" target="_blank" rel="noreferrer" className="link-icon">
        <svg className="app-footer-nav-icon" aria-label={TRANSLATIONS.github}>
          <use xlinkHref="#github" />
        </svg>
      </a>
    </footer>
  );
}
