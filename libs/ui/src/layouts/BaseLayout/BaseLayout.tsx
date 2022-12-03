import clsx from 'clsx';
import type { ReactNode } from 'react';
import defaultsDeep from 'lodash/defaultsDeep';

import { AppHeader, SvgSprite, IAppHeaderProps, AppFooter } from '../../';

import 'normalize.css';
import './_variables.css';
import './_root.css';
import './_alert.css';
import './_audio-player.css';
import './_card.css';
import './_forms.css';
import './_images.css';
import './_links.css';
import './_button.css';
import './_spacing.css';
import './_heading.css';
import './_app.css';
import './_logo.css';
import './_hero.css';
import './_dropdown.css';
import '../../views/AccountIndexView/AccountIndexView.css';
import './_utilities.css';

export type IBaseLayoutProps = Pick<IAppHeaderProps, 'user'> & {
  children: ReactNode;
  head: ReactNode;
  hero?: boolean;
  header?: boolean;
  footer?: boolean;
};

const defaultBaseLayoutProps: Partial<IBaseLayoutProps> = {
  header: true,
  footer: true,
};

export function BaseLayout({ children, head, hero, user, ...baseLayoutProps }: IBaseLayoutProps): JSX.Element {
  const { header, footer } = defaultsDeep({}, baseLayoutProps, defaultBaseLayoutProps);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        {head}
      </head>

      <body className={clsx({ 'body-with-hero': !!hero })}>
        <SvgSprite />
        {header && <AppHeader {...{ user, inverted: hero }} />}
        <main>{children}</main>
        {footer && <AppFooter />}
      </body>
    </html>
  );
}
