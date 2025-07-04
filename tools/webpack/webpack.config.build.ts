import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

import {
  getCodeRules,
  getFileLoaderRules,
  getHtmlWebpackPlugin,
  getImageMinimizer,
  getStylesheetRule
} from './common-config';

import ParagonWebpackPlugin from './plugins/paragon-webpack-plugin/ParagonWebpackPlugin';

import getLocalAliases from './utils/getLocalAliases';
import getPublicPath from './utils/getPublicPath';
import getResolvedSiteConfigPath from './utils/getResolvedSiteConfigPath';
import {
  getParagonCacheGroups,
  getParagonEntryPoints,
  getParagonThemeCss,
} from './utils/paragonUtils';

const paragonThemeCss = getParagonThemeCss(process.cwd());
const brandThemeCss = getParagonThemeCss(process.cwd(), { isBrandOverride: true });
const aliases = getLocalAliases();
const resolvedSiteConfigPath = getResolvedSiteConfigPath('site.config.build.tsx');

const config: Configuration = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: path.resolve(process.cwd(), 'node_modules/@openedx/frontend-base/shell/site'),
    ...getParagonEntryPoints(paragonThemeCss),
    ...getParagonEntryPoints(brandThemeCss),
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: getPublicPath(),
    clean: true, // Clean the output directory before emit.
  },
  resolve: {
    alias: {
      ...aliases,
      'site.config': resolvedSiteConfigPath,
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
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
      cacheGroups: {
        ...getParagonCacheGroups(paragonThemeCss),
        ...getParagonCacheGroups(brandThemeCss),
      },
    },
    minimizer: getImageMinimizer(),
  },
  // Specify additional processing or side-effects done on the Webpack output bundles as a whole.
  plugins: [
    // RemoveEmptyScriptsPlugin get rid of empty scripts generated by webpack when using mini-css-extract-plugin
    // This helps to clean up the final bundle application
    // See: https://www.npmjs.com/package/webpack-remove-empty-scripts#usage-with-mini-css-extract-plugin

    new RemoveEmptyScriptsPlugin(),
    // Writes the extracted CSS from each entry to a file in the output directory.
    new ParagonWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    }),
    getHtmlWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};

export default config;
