import { it, expect } from 'vitest';
import { isEqualUrl } from './url.service.js';

it('can compare almost equal urls', async () => {
  const a = 'https://example.com/feed1';
  const b = 'https://example.com/feed1/';
  expect(await isEqualUrl(a, b)).toBe(true);
});
