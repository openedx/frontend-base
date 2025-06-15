import path from 'path';
import { ConfigTypes } from './types';

// These config paths are tested in the order they're defined, so the last ones are the last fallback.
export const defaultConfigPaths = {
  [ConfigTypes.BABEL]: [
    path.resolve(process.cwd(), 'babel.config.js'),
    path.resolve(__dirname, './babel/babel.config.js'),
  ],
  [ConfigTypes.WEBPACK_BUILD]: [
    path.resolve(process.cwd(), 'webpack.config.build.js'),
    path.resolve(__dirname, './webpack/webpack.config.build.js'),
  ],
  [ConfigTypes.WEBPACK_DEV]: [
    path.resolve(process.cwd(), 'webpack.config.dev.js'),
    path.resolve(__dirname, './webpack/webpack.config.dev.js'),
  ],
  [ConfigTypes.WEBPACK_DEV_STANDALONE]: [
    path.resolve(process.cwd(), 'webpack.config.dev.standalone.js'),
    path.resolve(__dirname, './webpack/webpack.config.dev.standalone.js'),
  ],
  [ConfigTypes.WEBPACK_DEV_SHELL]: [
    path.resolve(process.cwd(), 'webpack.config.dev.shell.js'),
    path.resolve(__dirname, './webpack/webpack.config.dev.shell.js'),
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
