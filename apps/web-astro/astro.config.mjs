import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import turbolinks from '@astrojs/turbolinks';

export default defineConfig({
  outDir: '../../dist/apps/web-astro',
  integrations: [react(), sitemap(), turbolinks()],
  output: 'server',
  adapter: netlify(),
});
