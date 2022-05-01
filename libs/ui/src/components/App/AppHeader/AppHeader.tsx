import { NavLink } from '@remix-run/react';
import { User } from '@pdcstrrss/database';
import styles from './AppHeader.css';

export const AppHeaderLinks = () => [{ rel: 'stylesheet', href: styles }];

export type AppHeaderUser = Pick<User, 'displayName' | 'image'>;

interface AppHeaderProps {
  user: AppHeaderUser;
}

const navLinks = [
  {
    title: 'Episodes',
    to: '/episodes',
  },
  {
    title: 'Feeds',
    to: '/feeds',
  },
];

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header data-app-header data-container>
      <h1 data-app-header-title>PODCSTRRSS</h1>
      <nav>
        {navLinks.map(({ title, to }) => (
          <NavLink key={to} className={({ isActive }) => (isActive ? 'active' : undefined)} to={to}>
            {title}
          </NavLink>
        ))}
      </nav>
      {user.image && <img data-app-header-image src={user.image} alt={user.displayName} />}
    </header>
  );
}
