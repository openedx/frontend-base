const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  rootDir: process.cwd(),
  moduleNameMapper: {
    '\\.(css|scss)$': require.resolve('identity-obj-proxy'),
    'site.config': path.resolve(process.cwd(), './test.site.config.tsx'),
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@openedx|@edx)/)',
  ],
  modulePathIgnorePatterns: [
    '/dist/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};
