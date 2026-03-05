module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/setupTest.js',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svg.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir/__mocks__/file.js',
    '\\.(css|scss)$': require.resolve('identity-obj-proxy'),
    'site.config': '<rootDir>/site.config.test.tsx',
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  collectCoverageFrom: [
    '<rootDir>/**/*.{js,jsx,ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/setupTest.js',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@openedx|@edx)/)',
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
