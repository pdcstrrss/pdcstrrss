import type { AstroCookies } from 'astro/dist/core/cookies';

export const PASSED_GO_COOKIE_NAME = 'passedGo';

export function getPassedGo({ cookies }: { cookies: AstroCookies }) {
  const passedGo = cookies.get(PASSED_GO_COOKIE_NAME).boolean;
  return { passedGo };
}

export function setPassedGo({ value, cookies }: { value: boolean; cookies: AstroCookies }) {
  cookies.set(PASSED_GO_COOKIE_NAME, `${value}`);
}
