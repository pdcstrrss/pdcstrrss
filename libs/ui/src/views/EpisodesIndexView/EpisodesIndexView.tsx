import { PropsWithChildren } from 'react';
import { AppHeader } from '../../';
import type { AppHeaderUser } from '../../';

export interface IEpisodesIndexViewProps {
  user: AppHeaderUser;
  audioSource?: string;
}

export function EpisodesIndexView({ children, user, audioSource }: PropsWithChildren<IEpisodesIndexViewProps>) {
  return (
    <>
      <AppHeader user={user} />
      <main data-page-index data-page-index-with-audio-player={audioSource}>
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
