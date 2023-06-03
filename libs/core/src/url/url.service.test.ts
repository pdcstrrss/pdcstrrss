import { isEqualUrl } from './url.service';

test('can compare almost equal urls', async () => {
  const a = 'https://example.com/feed1';
  const b = 'https://example.com/feed1/';
  expect(await isEqualUrl(a, b)).toBe(true);
});
