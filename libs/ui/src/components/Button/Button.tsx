import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  reset?: boolean;
  link?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, reset, link, ...props }, ref) => {
  return (
    <button {...props} ref={ref} className={clsx({ button: true, 'button-reset': reset, 'button-link': link })}>
      {children}
    </button>
  );
});
