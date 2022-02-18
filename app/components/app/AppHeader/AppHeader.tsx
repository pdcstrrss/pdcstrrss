import React from "react";
import styles from "./AppHeader.css";

export const links = () => [
  { rel: "stylesheet", href: styles }
];

export const AppHeader = React.forwardRef(
  ({ children, ...props }, ref: any) => {
    return <header {...props} ref={ref}>
      <h1 data-app-header-title>PODCSTRRSS</h1>
    </header>;
  }
);
