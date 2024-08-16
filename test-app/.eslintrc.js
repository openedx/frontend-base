const { createConfig } = require('@openedx/frontend-base/config');

module.exports = createConfig('lint', {
  parserOptions: {
    project: './tsconfig.json',
  },
});
