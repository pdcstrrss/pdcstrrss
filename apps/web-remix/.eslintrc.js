const remixEslintConfig = require('@remix-run/eslint-config');

module.exports = {
  ignorePatterns: ['!**/*', '**/build/**', '**/node_modules/**', '**/.cache/**'],
  extends: ['plugin:@nrwl/nx/react', '../../.eslintrc.json'],
  rules: {
    ...remixEslintConfig.rules,
  },
  env: {
    ...remixEslintConfig.env,
  },
  plugins: [...remixEslintConfig.plugins],
  settings: {
    ...remixEslintConfig.settings,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      extends: [],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
    remixEslintConfig.overrides[1],
  ],
};
