import type { FORM_ACTIONS, FORM_SUBJECTS } from '../../constants/forms.js';

export type FormProps = JSX.IntrinsicElements['form'] & {
  form: {
    action?: string;
    method: 'get' | 'post';
    target?: string;
    enctype?: string;
    autocomplete?: string;
    novalidate?: boolean;
  };
  action: FORM_ACTIONS;
  subject: FORM_SUBJECTS;
  clientSideHandling?: boolean;
  error?: string;
};

export const Form = ({ form, action, subject, error, clientSideHandling, children }: FormProps) => (
  <form {...form} data-client-side-handling={clientSideHandling || false} data-astro-reload>
    {error && (
      <div data-alert data-alert-danger>
        {error}
      </div>
    )}
    <input type="hidden" name="action" value={action} />
    <input type="hidden" name="subject" value={subject} />
    {children}
  </form>
);
