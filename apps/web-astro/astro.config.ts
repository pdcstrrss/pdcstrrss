import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// import { FontaineTransform } from 'fontaine';

export default defineConfig({
  outDir: '../../dist/apps/web-astro',
  integrations: [react(), sitemap()],
  output: 'server',
  adapter: netlify(),
  vite: {
    ssr: {
      noExternal: ['path-to-regexp'],
    },
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
    //   plugins: [
    //     FontaineTransform.vite({ fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans'] }),
    //   ],
  },
});
