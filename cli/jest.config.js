module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  rootDir: process.cwd(),
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
