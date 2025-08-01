import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

import {
  getCodeRules,
  getDevServer,
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
const resolvedSiteConfigPath = getResolvedSiteConfigPath('site.config.dev.tsx');

const config: Configuration = {
  entry: {
    app: path.resolve(process.cwd(), 'node_modules/@openedx/frontend-base/shell/site'),
    ...getParagonEntryPoints(paragonThemeCss),
    ...getParagonEntryPoints(brandThemeCss),
  },
  output: {
    path: path.resolve(process.cwd(), './dist'),
    publicPath: getPublicPath(),
  },
  resolve: {
    alias: {
      ...aliases,
      'site.config': resolvedSiteConfigPath,
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      ...getCodeRules('dev', resolvedSiteConfigPath),
      getStylesheetRule('dev'),
      ...getFileLoaderRules(),
    ],
  },
  optimization: {
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
    new ParagonWebpackPlugin(),
    // Writes the extracted CSS from each entry to a file in the output directory.
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    getHtmlWebpackPlugin(),
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  // This configures webpack-dev-server which serves bundles from memory and provides live
  // reloading.

  devServer: getDevServer(),

  // Limit the number of watched files to avoid `inotify` resource starvation.
  watchOptions: {
    ignored: /node_modules/
  }
};

export default config;
