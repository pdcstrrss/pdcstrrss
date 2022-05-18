import { PropsWithChildren } from 'react';


export interface IAuthenticatedLayoutProps {
  audioSource?: string;
}

export function AuthenticatedLayout({ children, audioSource }: PropsWithChildren<IAuthenticatedLayoutProps>) {
  return (
    <main data-page-index data-page-index-with-audio-player={audioSource} className='container'>
      {children}
      {audioSource && (
        <div data-audio-player>
          <audio src={audioSource} controls />
        </div>
      )}
    </main>
  );
}
