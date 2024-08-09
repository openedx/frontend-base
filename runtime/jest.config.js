module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/runtime/setupTest.js',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/runtime/__mocks__/svg.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/runtime/__mocks__/file.js',
    '\\.(css|scss)$': require.resolve('identity-obj-proxy'),
    'env.config': '<rootDir>/runtime/__mocks__/env.config.js',
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  rootDir: process.cwd(),
  collectCoverageFrom: [
    'runtime/**/*.{js,jsx,ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'setupTest.js',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@openedx|@edx)/)',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist',
    '<rootDir>/shell',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/',
  ],
};
