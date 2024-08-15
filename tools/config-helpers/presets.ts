import path from 'path';

import { ConfigPresets } from '../types';
import createConfigPreset from './createConfigPreset';

const searchFilepaths = [process.cwd()];

const babel = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../babel'),
  defaultFilename: 'babel.config.js',
  searchFilenames: ['babel.config.js'],
  searchFilepaths,
});

const build = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../webpack'),
  defaultFilename: 'webpack.build.config.js',
  searchFilenames: ['webpack.build.config.js'],
  searchFilepaths,
});

const buildModule = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../webpack'),
  defaultFilename: 'webpack.build.module.config.js',
  searchFilenames: ['webpack.build.module.config.js'],
  searchFilepaths,
});

const dev = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../webpack'),
  defaultFilename: 'webpack.dev.config.js',
  searchFilenames: ['webpack.dev.config.js'],
  searchFilepaths,
});

const devModule = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../webpack'),
  defaultFilename: 'webpack.dev.module.config.js',
  searchFilenames: ['webpack.dev.module.config.js'],
  searchFilepaths,
});

const lint = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../eslint'),
  defaultFilename: '.eslintrc.js',
  searchFilenames: ['.eslintrc.js'],
  searchFilepaths,
});

const test = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../jest'),
  defaultFilename: 'jest.config.js',
  searchFilenames: ['jest.config.js'],
  searchFilepaths,
});


const presets: ConfigPresets = {
  babel,
  build,
  'build:module': buildModule,
  dev,
  'dev:module': devModule,
  lint,
  test,
}
export default presets;
