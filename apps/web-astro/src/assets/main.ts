import { signIn } from 'auth-astro/client';
import { handleFormSubmit } from './form';

//
// Form submissions
//
document.body.addEventListener('submit', (event) => {
  if (!(event.target instanceof HTMLFormElement)) return;
  if (event.target.dataset.clientSideHandling === 'true') {
    handleFormSubmit({ event });
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
