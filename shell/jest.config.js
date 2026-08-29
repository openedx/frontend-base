module.exports = {
  setupFilesAfterEnv: [
    './setupTest.js',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/testMocks/svg.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/testMocks/file.js',
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
    '/node_modules/',
    'setupTest.js',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@openedx|@edx|react-intl|@formatjs|intl-messageformat)/)',
  ],
  testPathIgnorePatterns: [
    '/site.config.test.tsx',
    '/node_modules/',
    '/dist/',
  ],
};
