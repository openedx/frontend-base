const { createConfig } = require('../config');

module.exports = createConfig('jest', {
  setupFilesAfterEnv: [
    '<rootDir>/runtime/setupTest.js',
  ],
  roots: [
    '<rootDir>/runtime',
  ]
});
