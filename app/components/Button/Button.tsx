import React from "react";
import styles from "./Button.css";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  reset?: boolean;
}

export const links = () => [{ rel: "stylesheet", href: styles }];

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, reset = false, ...props }, ref) => {
  return (
    <button {...props} ref={ref} data-button data-button-reset={reset}>
      {children}
    </button>
  );
});
