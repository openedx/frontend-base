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
  modulePathIgnorePatterns: [
    '/dist/',
  ],
  testPathIgnorePatterns: [
    '/site.config.test.tsx',
    '/node_modules/',
    '/dist/',
  ],
};
