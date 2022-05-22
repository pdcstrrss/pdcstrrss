import clsx from 'clsx';
import { PropsWithChildren } from 'react';


export interface IAuthenticatedLayoutProps {
  audioSource?: string;
}

export function AuthenticatedLayout({ children, audioSource }: PropsWithChildren<IAuthenticatedLayoutProps>) {
  return (
    <div className={clsx('container container-md')}>
      {children}
      {audioSource && (
        <div data-audio-player>
          <audio src={audioSource} controls />
        </div>
      )}
    </div>
  );
}
