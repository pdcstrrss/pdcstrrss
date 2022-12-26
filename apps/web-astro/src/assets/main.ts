import './polyfills';

import { handleFormSubmit } from './form';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Swup from 'swup';

//
// Page transitions
//
const swup = new Swup();

//
// Form submissions
//
document.body.addEventListener('submit', (event) => {
  if (event.target instanceof HTMLFormElement) return handleFormSubmit({ event, swup });
});
