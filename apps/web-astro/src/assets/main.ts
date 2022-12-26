import Swup from 'swup';
import SwupFadeTheme from '@swup/fade-theme';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupA11yPlugin from '@swup/a11y-plugin';

import './polyfills';
import { handleFormSubmit } from './form';

//
// Page transitions
//
const swupOptions = {
  plugins: [new SwupFadeTheme(), new SwupHeadPlugin(), new SwupA11yPlugin()],
};
const swup = new Swup(swupOptions);

//
// Form submissions
//
document.body.addEventListener('submit', (event) => {
  if (event.target instanceof HTMLFormElement) return handleFormSubmit({ event, swup });
});
