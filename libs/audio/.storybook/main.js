const rootMain = require('../../../.storybook/main');

module.exports = {
  ...rootMain,
  stories: [...rootMain.stories, '../src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [...rootMain.addons],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
