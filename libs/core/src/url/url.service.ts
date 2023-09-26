import normalizeUrl from 'normalize-url';

export { default as normalizeUrl } from 'normalize-url';

export function isEqualUrl(a: string, b: string) {
  return normalizeUrl(a) === normalizeUrl(b);
}
