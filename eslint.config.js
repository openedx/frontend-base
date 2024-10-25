// @ts-check

const tseslint = require('typescript-eslint');
const eslintConfig = require('./tools/eslint/base.eslint.config.js');

module.exports = tseslint.config(
  {
    extends: eslintConfig,
  },
  {
    ignores: [
      'tools/*',
      'test-project/*',
      'config/*',
      'docs/*',
    ],
  },
);
