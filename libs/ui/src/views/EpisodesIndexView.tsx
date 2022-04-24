import { User } from '@pdcstrrss/database';
import { PropsWithChildren } from 'react';
import { AppHeader } from '..';

export interface IEpisodesIndexViewProps {
  user: User;
  audioSource?: string;
}

export function EpisodesIndexView({
  children,
  user,
  audioSource,
}: PropsWithChildren<IEpisodesIndexViewProps>) {
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
