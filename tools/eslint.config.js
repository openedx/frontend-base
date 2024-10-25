// @ts-check

const tseslint = require('typescript-eslint');
const eslintConfig = require('./eslint/base.eslint.config.js');

module.exports = tseslint.config(
  {
    extends: eslintConfig,
  },
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
);
