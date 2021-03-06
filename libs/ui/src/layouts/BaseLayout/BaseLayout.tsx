import clsx from 'clsx';
import type { ReactNode } from 'react';
import defaultsDeep from 'lodash/defaultsDeep';

import { AppHeader, SvgSprite, IAppHeaderProps, AppFooter } from '../../';

import normalize from 'normalize.css';
import variables from './_variables.css';
import root from './_root.css';
import alert from './_alert.css';
import audio from './_audio-player.css';
import card from './_card.css';
import forms from './_forms.css';
import images from './_images.css';
import links from './_links.css';
import button from './_button.css';
import spacing from './_spacing.css';
import heading from './_heading.css';
import app from './_app.css';
import logo from './_logo.css';
import hero from './_hero.css';
import dropdown from './_dropdown.css';
import viewAccount from '../../views/AccountIndexView/AccountIndexView.css';
import utilities from './_utilities.css';

export function BaseLayoutLinks() {
  return [
    ...[
      normalize,
      'https://use.typekit.net/xkw3emo.css',
      variables,
      root,
      heading,
      links,
      button,
      images,
      forms,
      spacing,
      app,
      alert,
      audio,
      card,
      logo,
      hero,
      dropdown,
      viewAccount,
      utilities,
    ].map((href) => ({
      href,
      rel: 'stylesheet',
    })),
  ];
}

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
