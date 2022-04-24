import { AppHeaderLinks, SvgSprite } from '@pdcstrrss/ui';
import { ReactNode } from 'react';

import normalize from 'normalize.css';
import styles from './BaseLayout.css';

export function BaseLayoutLinks() {
  return [
    ...AppHeaderLinks(),
    ...[normalize, 'https://rsms.me/inter/inter.css', styles].map((href) => ({
      href,
      rel: 'stylesheet',
    })),
  ];
}

export interface IBaseLayoutProps {
  children: ReactNode;
  head: ReactNode;
}

export function BaseLayout({ children, head }: IBaseLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {head}
      </head>
      <body>
        <SvgSprite />
        {children}
      </body>
    </html>
  );
}
