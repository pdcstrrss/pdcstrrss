import Swup from 'swup';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupA11yPlugin from '@swup/a11y-plugin';
import { signIn } from 'auth-astro/client';

import { handleFormSubmit } from './form';

//
// Page transitions
//
const swupOptions = {
  cache: false,
  plugins: [new SwupHeadPlugin(), new SwupA11yPlugin()],
};
const swup = new Swup(swupOptions);

//
// Form submissions
//
document.body.addEventListener('submit', (event) => {
  if (!(event.target instanceof HTMLFormElement)) return;
  if (event.target.dataset.clientSideHandling !== 'true') {
    return handleFormSubmit({ event, swup });
  }
});

//
//  Sign in
//
document.body.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  if (target.matches('[data-signin-key]')) {
    try {
      const provider = target.dataset.signinProvider;
      const options = JSON.parse(target.dataset.signinOptions || '{}');
      const authParams = JSON.parse(target.dataset.signinAuthParams || '{}');
      await signIn(provider, options, authParams);
    } catch (error) {
      console.error(error);
    }
  }
});
