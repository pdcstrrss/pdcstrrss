import { clsx } from 'clsx';
import { TRANSLATIONS } from '../../../constants/index.js';

export function AppFooter() {
  const thisYear = new Date().getFullYear();
  return (
    <footer className={clsx('app-footer container')}>
      <div className="app-footer-logo">
        &copy; {thisYear} {TRANSLATIONS.title}
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
