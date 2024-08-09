const { createConfig } = require('@openedx/frontend-base/tools');

module.exports = createConfig('eslint', {
  parserOptions: {
    project: './tsconfig.json',
  },
});
