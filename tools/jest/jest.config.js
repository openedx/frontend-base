const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  rootDir: process.cwd(),
  moduleNameMapper: {
    '\\.(css|scss)$': require.resolve('identity-obj-proxy'),
    'site.config': path.resolve(process.cwd(), './site.config.test.tsx'),
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@openedx|@edx|react-intl|@formatjs|intl-messageformat)/)',
  ],
  /*
   * 'packages/' holds gitignored, bind-mounted checkouts used for local
   * development.  Excluding it here keeps jest-haste-map from crawling those
   * checkouts, which would otherwise register their manual mocks and collect
   * their test suites as if they belonged to this app.
   */
  modulePathIgnorePatterns: [
    '/dist/',
    '<rootDir>/packages/',
  ],
  testPathIgnorePatterns: [
    '/site.config.test.tsx',
    '/node_modules/',
    '/dist/',
    '<rootDir>/packages/',
  ],
};
