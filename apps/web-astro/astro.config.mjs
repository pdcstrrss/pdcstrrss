import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import sitemap from '@astrojs/sitemap';
import turbolinks from '@astrojs/turbolinks';

export default defineConfig({
  outDir: '../../dist/apps/web-astro',
  integrations: [sitemap(), turbolinks()],
  output: 'server',
  adapter: netlify(),
});
