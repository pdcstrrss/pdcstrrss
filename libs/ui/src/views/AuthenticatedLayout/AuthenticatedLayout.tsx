import { PropsWithChildren } from 'react';
import { AppHeader } from '../..';
import type { AppHeaderUser } from '../..';

export interface IAuthenticatedLayoutProps {
  user: AppHeaderUser;
  audioSource?: string;
}

export function AuthenticatedLayout({ children, user, audioSource }: PropsWithChildren<IAuthenticatedLayoutProps>) {
  return (
    <>
      <AppHeader user={user} />
      <main data-page-index data-page-index-with-audio-player={audioSource} data-container>
        {children}
        {audioSource && (
          <div data-audio-player>
            <audio src={audioSource} controls />
          </div>
        )}
      </main>
    </>
  );
}
