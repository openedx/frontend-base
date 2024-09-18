import { ModuleFederationPlugin } from '@module-federation/enhanced';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import {
  getCodeRules,
  getFileLoaderRules,
  getIgnoreWarnings,
  getImageMinimizer,
  getStylesheetRule
} from './common-config';

import getLocalAliases from './utils/getLocalAliases';
import getModuleFederationConfig from './utils/getModuleFederationConfig';
import getPublicPath from './utils/getPublicPath';
import getResolvedSiteConfigPath from './utils/getResolvedSiteConfigPath';
import getSharedDependencies from './utils/getSharedDependencies';

const aliases = getLocalAliases();
const moduleFederationConfig = getModuleFederationConfig();
const resolvedSiteConfigPath = getResolvedSiteConfigPath('site.config.build.module.tsx');
const publicPath = getPublicPath();

const config: Configuration = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: path.resolve(process.cwd(), 'src/index'),
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(process.cwd(), 'dist'),
    publicPath,
    clean: true, // Clean the output directory before emit.
    uniqueName: `mf-${moduleFederationConfig.name}`, // Needed for module federation.
  },
  resolve: {
    alias: {
      ...aliases,
      'site.config': resolvedSiteConfigPath,
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  ignoreWarnings: getIgnoreWarnings(),
  module: {
    rules: [
      ...getCodeRules('production', resolvedSiteConfigPath),
      getStylesheetRule('production'),
      ...getFileLoaderRules(),
    ],
  },
  // Extract common modules among all chunks to one common chunk and extract the Webpack runtime to a single runtime chunk.
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
    minimizer: getImageMinimizer(),
  },
  // Specify additional processing or side-effects done on the Webpack output bundles as a whole.
  plugins: [
    // Writes the extracted CSS from each entry to a file in the output directory.
    new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new ModuleFederationPlugin({
      name: moduleFederationConfig.name,
      filename: 'remoteEntry.js',
      exposes: moduleFederationConfig.exposes,
      shared: getSharedDependencies({ isShell: false })
    }),
  ],
};

export default config;
