const path = require('path');

const { createConfig } = require('./config');

module.exports = createConfig('eslint', {
  ignorePatterns: [
    'test-app',
    'docs',
    '.eslintrc.js',
    'frontend-base.d.ts',
    'coverage',
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
