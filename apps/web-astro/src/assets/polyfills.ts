if ('inert' in HTMLElement.prototype) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await import('inert-polyfill');
}

export {}
