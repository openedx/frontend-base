const { createConfig } = require('@openedx/frontend-base');

module.exports = createConfig('eslint', {
  parserOptions: {
    project: './tsconfig.json',
  },
});
