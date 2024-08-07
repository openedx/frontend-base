const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  rootDir: process.cwd(),
  moduleNameMapper: {
    '\\.(css|scss)$': require.resolve('identity-obj-proxy'),
    'env.config': path.resolve(process.cwd(), './env.test.config.tsx'),
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'setupTest.js',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@openedx|@edx)/)',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/',
  ],
};
