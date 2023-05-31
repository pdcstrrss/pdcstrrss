import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import auth from 'auth-astro';

// import { FontaineTransform } from 'fontaine';

export default defineConfig({
  outDir: '../../dist/apps/web-astro',
  integrations: [react(), sitemap(), auth()],
  output: 'server',
  adapter: netlify(),
  vite: {
    ssr: {
      noExternal: ['path-to-regexp'],
    },
    resolve: {
      alias: [
        {
          find: '.prisma/client/index-browser',
          replacement: './node_modules/.prisma/client/index-browser.js',
        },
        {
          find: 'auth:config',
          // replacement: path.resolve('./node_modules/auth-astro/src/config.ts'),
          replacement: './auth.config.ts',
        },
      ],
    },
    optimizeDeps: { exclude: ['auth:config'] },

    //   plugins: [
    //     FontaineTransform.vite({ fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans'] }),
    //   ],
  },
});
