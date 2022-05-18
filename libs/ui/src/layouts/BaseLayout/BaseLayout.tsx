import clsx from 'clsx';
import { ReactNode } from 'react';

import { AppHeader, SvgSprite, IAppHeaderProps } from '../../';

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
import page from './_page.css';
import spacing from './_spacing.css';
import heading from './_heading.css';
import app from './_app.css';
import logo from './_logo.css';
import hero from './_hero.css';
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
      page,
      alert,
      audio,
      card,
      logo,
      hero,
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
};

export function BaseLayout({ children, head, hero, user }: IBaseLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {head}
      </head>
      <body className={clsx({ 'body-with-hero': !!hero })}>
        <SvgSprite />
        <AppHeader {...{ user, inverted: hero }} />
        {children}
      </body>
    </html>
  );
}
