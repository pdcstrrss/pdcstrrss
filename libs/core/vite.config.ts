import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    testTimeout: 30 * 1000,
    hookTimeout: 30 * 1000,
  },
});
