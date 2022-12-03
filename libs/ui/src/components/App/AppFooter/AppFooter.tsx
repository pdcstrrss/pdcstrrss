import clsx from 'clsx';
import { TRANSLATIONS } from '../../../constants';

export function AppFooter() {
  return (
    <footer className={clsx('app-footer container')}>
      <div className="app-footer-logo">
        <a href="/">{TRANSLATIONS.title}</a>
      </div>

      <a href="/privacy">Privacy</a>

      <a href="https://github.com/pdcstrrss" target="_blank" rel="noreferrer" className="link-icon">
        <svg className="app-footer-nav-icon" aria-label={TRANSLATIONS.github}>
          <use xlinkHref="#github" />
        </svg>
      </a>
    </footer>
  );
}
