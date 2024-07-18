const path = require('path');
const fs = require('fs');

let envConfigPath = path.resolve(__dirname, './jest/fallback.env.config.js');
const appEnvConfigPath = path.resolve(process.cwd(), './env.config.js');

if (fs.existsSync(appEnvConfigPath)) {
  envConfigPath = appEnvConfigPath;
}

module.exports = {
  // TypeScript and JavaScript files (.ts, .tsx, .js, .jsx) will be transformed by ts-jest to CommonJS syntax.
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  setupFiles: [
    path.resolve(__dirname, 'jest/setupTest.js'),
  ],
  rootDir: process.cwd(),
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    'env.config': envConfigPath,
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
};
