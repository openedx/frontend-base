const path = require('path');
const { merge } = require('webpack-merge');

const config = require('./tools/eslint/.eslintrc.js');

module.exports = merge(config, {
  ignorePatterns: [
    'test-app',
    'docs',
    '.eslintrc.js',
    'frontend-base.d.ts',
    'coverage',
    'example',
    'example-plugin-app',
    'tools',
    'config',
  ],
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
  },
  rules: {
    'no-console': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'no-template-curly-in-string': 'off',
  },
});
