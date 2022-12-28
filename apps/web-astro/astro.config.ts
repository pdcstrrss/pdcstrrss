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
  // vite: {
  //   plugins: [
  //     FontaineTransform.vite({ fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans'] }),
  //   ],
  // },
});
