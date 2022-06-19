// copy public path to dist/web-remix/client
// copy server path to dist/web-remix/client
// build,,

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: '../../dist/apps/web-remix/public/build',
  publicPath: '/build/',
  serverBuildTarget: "netlify-edge",
  serverBuildDirectory: '../../dist/apps/web-remix/edge-functions/server/build',
  server: "./server/index.ts",
  devServerPort: 8002,
  ignoredRouteFiles: ['.*'],
};
