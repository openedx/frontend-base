const path = require('path');

const { createConfig } = require('.');

module.exports = createConfig('eslint', {
  ignorePatterns: [
    'test-app',
    'docs',
    'runtime', // TODO: Remove this ignore
    '.eslintrc.js',
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
