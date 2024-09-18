import { transform } from '@formatjs/ts-transformer';
import { ModuleFederationPlugin } from '@module-federation/enhanced';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import PostCssAutoprefixerPlugin from 'autoprefixer';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import path from 'path';
import PostCssCustomMediaCSS from 'postcss-custom-media';
import PostCssRTLCSS from 'postcss-rtlcss';
import { Configuration, WebpackError } from 'webpack';

import {
  getDevServer,
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

const publicPath = getPublicPath();
const aliases = getLocalAliases();
const moduleFederationConfig = getModuleFederationConfig();
const resolvedSiteConfigPath = getResolvedSiteConfigPath('site.config.dev.module.tsx');

const config: Configuration = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    app: path.resolve(process.cwd(), 'src/index'),
  },
  output: {
    path: path.resolve(process.cwd(), './dist'),
    publicPath,
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
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          /src/,
          path.resolve(process.cwd(), './site.config.dev.module.tsx'),
        ],
        use: {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false,
            },
            getCustomTransformers() {
              return {
                before: [
                  transform({
                    overrideIdFn: '[sha512:contenthash:base64:6]',
                  }),
                ],
              };
            },
          },
        },
      },
      getStylesheetRule('dev'),
       ...getFileLoaderRules(),
    ],
  },
  optimization: {
    minimizer: getImageMinimizer(),
  },
  // Specify additional processing or side-effects done on the Webpack output bundles as a whole.
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new ModuleFederationPlugin({
      name: moduleFederationConfig.name,
      filename: 'remoteEntry.js',
      exposes: moduleFederationConfig.exposes,
      shared: getSharedDependencies({ isShell: false })
    }),
  ],
  // This configures webpack-dev-server which serves bundles from memory and provides live
  // reloading.
  devServer: getDevServer(),
};

export default config;
