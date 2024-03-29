import { globby } from 'globby';
import { copy } from 'fs-extra';
import { rimraf } from 'rimraf';

// Clean
await rimraf('../../dist/hosting/netlify/public');
await rimraf('../../dist/hosting/netlify/functions/ssr');

// Astro function
const paths = await globby(['.netlify/functions-internal/ssr/**']);
paths.forEach(async (path) => {
  await copy(path, path.replace('.netlify/functions-internal/ssr', '../../dist/hosting/netlify/functions/ssr'));
});

// Static files
await copy('dist', '../../dist/hosting/netlify/public');

// Cleanup
await rimraf('.netlify');
await rimraf('dist');
