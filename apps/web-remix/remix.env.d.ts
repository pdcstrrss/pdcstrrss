/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import { AriaAttributes, DOMAttributes } from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    inert?: string | undefined;
  }
}
