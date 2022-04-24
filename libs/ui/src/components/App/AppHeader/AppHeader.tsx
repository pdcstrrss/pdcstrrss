import { User } from "@pdcstrrss/database";
import styles from "./AppHeader.css";

export const AppHeaderLinks = () => [{ rel: "stylesheet", href: styles }];

export type AppHeaderUser = Pick<User, "displayName" | "image">;

interface AppHeaderProps {
  user: AppHeaderUser;
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header data-app-header>
      <h1 data-app-header-title>PODCSTRRSS</h1>
      {user.image && <img  data-app-header-image src={user.image} alt={user.displayName} />}
    </header>
  );
}
