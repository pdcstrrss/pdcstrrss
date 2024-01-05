import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30 * 1000,
    hookTimeout: 30 * 1000,
  },
});
