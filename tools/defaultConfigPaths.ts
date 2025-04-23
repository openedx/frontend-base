import path from 'path';
import { ConfigTypes } from './types';

// These config paths are tested in the order they're defined, so the last ones are the last fallback.
export const defaultConfigPaths = {
  [ConfigTypes.BABEL]: [
    path.resolve(process.cwd(), 'babel.config.js'),
    path.resolve(__dirname, './babel/babel.config.js'),
  ],
  [ConfigTypes.WEBPACK_BUILD]: [
    path.resolve(process.cwd(), 'webpack.build.config.js'),
    path.resolve(__dirname, './webpack/webpack.build.config.js'),
  ],
  [ConfigTypes.WEBPACK_BUILD_MODULE]: [
    path.resolve(process.cwd(), 'webpack.build.module.config.js'),
    path.resolve(__dirname, './webpack/webpack.build.module.config.js'),
  ],
  [ConfigTypes.WEBPACK_DEV]: [
    path.resolve(process.cwd(), 'webpack.dev.config.js'),
    path.resolve(__dirname, './webpack/webpack.dev.config.js'),
  ],
  [ConfigTypes.WEBPACK_DEV_LEGACY]: [
    path.resolve(process.cwd(), 'webpack.dev.legacy.config.js'),
    path.resolve(__dirname, './webpack/webpack.dev.legacy.config.js'),
  ],
  [ConfigTypes.WEBPACK_DEV_MODULE]: [
    path.resolve(process.cwd(), 'webpack.dev.module.config.js'),
    path.resolve(__dirname, './webpack/webpack.dev.module.config.js'),
  ],
  [ConfigTypes.WEBPACK_DEV_SHELL]: [
    path.resolve(process.cwd(), 'webpack.dev.shell.config.js'),
    path.resolve(__dirname, './webpack/webpack.dev.shell.config.js'),
  ],
  [ConfigTypes.LINT]: [
    path.resolve(process.cwd(), 'eslint.config.js'),
    path.resolve(__dirname, './eslint/base.eslint.config.js'),
  ],
  [ConfigTypes.TEST]: [
    path.resolve(process.cwd(), 'jest.config.js'),
    path.resolve(__dirname, './jest/jest.config.js'),
  ],
};
