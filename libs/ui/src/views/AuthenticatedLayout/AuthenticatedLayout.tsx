import { PropsWithChildren } from 'react';

export interface IAuthenticatedLayoutProps {
  audioSource?: string;
}

export function AuthenticatedLayout({ children, audioSource }: PropsWithChildren<IAuthenticatedLayoutProps>) {
  return (
    <>
      {children}
      {audioSource && (
        <div className='audio-player'>
          <audio src={audioSource} controls />
        </div>
      )}
    </>
  );
}
