module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  collectCoverageFrom: [
    'cli/**/*.{js,jsx,ts,tsx}',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@openedx|@edx|react-intl|@formatjs|intl-messageformat)/)',
  ],
  modulePathIgnorePatterns: [
    '/dist/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};
