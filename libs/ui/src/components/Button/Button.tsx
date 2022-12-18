import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  reset?: boolean;
  link?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, reset, link, className, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={clsx({ button: true, 'button-reset': reset, 'button-link': link }, className)}
      >
        {children}
      </button>
    );
  }
);
