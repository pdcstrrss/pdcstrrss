/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "../../dist/apps/web-remix/public/build",
  publicPath: "../../dist/apps/web-remix/build/",
  serverBuildDirectory: "../../dist/apps/web-remix/netlify/functions/server/build",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"]
};
