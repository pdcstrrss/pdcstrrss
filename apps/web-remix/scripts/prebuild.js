const { copy } = require('fs-extra');
const { resolve } = require('path');

const SRC_DIR = resolve(__dirname, '../');
const EDGE_FUNCTIONS_SRC_DIR = resolve(SRC_DIR, 'server');
const PUBLIC_SRC_DIR = resolve(SRC_DIR, 'public');
const BUILD_DIR = resolve(__dirname, '../../../dist/apps/web-remix');
const EDGE_FUNCTIONS_BUILD_DIR = resolve(BUILD_DIR, 'edge-functions/server');
const PUBLIC_BUILD_DIR = resolve(BUILD_DIR, 'public');

(async () => {
  await copy(resolve(SRC_DIR, 'server.ts'), resolve(BUILD_DIR, 'edge-functions/server.ts'));
  await copy(EDGE_FUNCTIONS_SRC_DIR, EDGE_FUNCTIONS_BUILD_DIR);
  await copy(PUBLIC_SRC_DIR, PUBLIC_BUILD_DIR);
})();

module.exports = {
  SRC_DIR,
  PUBLIC_SRC_DIR,
  BUILD_DIR,
  PUBLIC_BUILD_DIR,
};
