// import { navigate } from 'astro:transitions/client';

export function handleFormSubmit({ event }: { event: SubmitEvent }) {
  // event.preventDefault();

  const form = event.target as HTMLFormElement;
  form.inert = true;

  const submitBtns = form.querySelectorAll('[data-text-content-on-submit]');
  submitBtns.forEach((btn) => {
    btn.setAttribute('disabled', 'disabled');
    btn.textContent = btn.getAttribute('data-text-content-on-submit');
  });

  // const url = form.action.length > 0 ? form.action : window.location.href;

  // navigate(url);
}
