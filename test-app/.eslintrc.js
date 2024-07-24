const { createConfig } = require('@openedx/frontend-base/config');

module.exports = createConfig('eslint', {
  parserOptions: {
    project: './tsconfig.json',
  },
});
