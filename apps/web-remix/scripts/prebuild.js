const { copy } = require('fs-extra');
const { resolve } = require('path');
const rimraf = require('rimraf');

const SRC_DIR = resolve(__dirname, '../');
const FUNCTIONS_SRC_DIR = resolve(SRC_DIR, 'netlify/functions');
const PUBLIC_SRC_DIR = resolve(SRC_DIR, 'public');
const BUILD_DIR = resolve(__dirname, '../../../dist/apps/web-remix');
const FUNCTIONS_BUILD_DIR = resolve(BUILD_DIR, 'functions');
const PUBLIC_BUILD_DIR = resolve(BUILD_DIR, 'public');

(async () => {
  await rimraf.sync(resolve(FUNCTIONS_SRC_DIR, 'server'));
  await rimraf.sync(resolve(PUBLIC_SRC_DIR));
  await copy(FUNCTIONS_SRC_DIR, FUNCTIONS_BUILD_DIR);
  await copy(PUBLIC_SRC_DIR, PUBLIC_BUILD_DIR);
})();

module.exports = {
  SRC_DIR,
  FUNCTIONS_SRC_DIR,
  PUBLIC_SRC_DIR,
  BUILD_DIR,
  FUNCTIONS_BUILD_DIR,
  PUBLIC_BUILD_DIR,
};
