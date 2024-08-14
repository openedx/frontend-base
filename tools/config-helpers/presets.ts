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

const eslint = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../eslint'),
  defaultFilename: '.eslintrc.js',
  searchFilenames: ['.eslintrc.js'],
  searchFilepaths,
});

const jest = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../jest'),
  defaultFilename: 'jest.config.js',
  searchFilenames: ['jest.config.js'],
  searchFilepaths,
});

const webpackDevServer = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../webpack'),
  defaultFilename: 'webpack.dev.config.js',
  searchFilenames: ['webpack.dev.config.js'],
  searchFilepaths,
});

const shellDevServer = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../webpack'),
  defaultFilename: 'webpack.shell.dev.config.js',
  searchFilenames: ['webpack.shell.dev.config.js'],
  searchFilepaths,
});

const webpackDevServerStage = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../webpack'),
  defaultFilename: 'webpack.dev-stage.config.js',
  searchFilenames: ['webpack.dev-stage.config.js'],
  searchFilepaths,
});

const webpack = createConfigPreset({
  defaultDir: path.resolve(__dirname, '../webpack'),
  defaultFilename: 'webpack.prod.config.js',
  searchFilenames: ['webpack.prod.config.js'],
  searchFilepaths,
});

const presets: ConfigPresets = {
  babel,
  eslint,
  jest,
  webpack,
  'webpack-dev-server': webpackDevServer,
  'shell-dev-server': shellDevServer,
  'webpack-dev-server-stage': webpackDevServerStage,
  'webpack-prod': webpack,
}
export default presets;
