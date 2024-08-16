module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  rootDir: process.cwd(),
  collectCoverageFrom: [
    'cli/**/*.{js,jsx,ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@openedx|@edx)/)',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist',
    '<rootDir>/runtime',
    '<rootDir>/shell',
    '<rootDir>/tools/dist',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist',
    '<rootDir>/tools/dist',
  ],
};
