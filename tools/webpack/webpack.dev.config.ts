import { transform } from '@formatjs/ts-transformer';
import { ModuleFederationPlugin } from '@module-federation/enhanced';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import PostCssAutoprefixerPlugin from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import PostCssCustomMediaCSS from 'postcss-custom-media';
import PostCssRTLCSS from 'postcss-rtlcss';
import { Configuration, WebpackError } from 'webpack';
import 'webpack-dev-server'; // Required to get devServer types added to Configuration
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

import {
  getImageMinimizer,
} from './common-config';
import ParagonWebpackPlugin from './plugins/paragon-webpack-plugin/ParagonWebpackPlugin';
import getLocalAliases from './utils/getLocalAliases';
import getSharedDependencies from './utils/getSharedDependencies';
import {
  getParagonCacheGroups,
  getParagonEntryPoints,
  getParagonThemeCss,
} from './utils/paragonUtils';

const paragonThemeCss = getParagonThemeCss(process.cwd());
const brandThemeCss = getParagonThemeCss(process.cwd(), { isBrandOverride: true });
const aliases = getLocalAliases();
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

function getStyleUseConfig() {
  return [
    {
      loader: require.resolve('css-loader'), // translates CSS into CommonJS
      options: {
        sourceMap: true,
        modules: {
          compileType: 'icss',
        },
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [
            PostCssAutoprefixerPlugin(),
            PostCssRTLCSS(),
            PostCssCustomMediaCSS(),
          ],
        },
      },
    },
    require.resolve('resolve-url-loader'),
    {
      loader: require.resolve('sass-loader'), // compiles Sass to CSS
      options: {
        sourceMap: true,
        sassOptions: {
          includePaths: [
            path.join(process.cwd(), 'node_modules'),
            path.join(process.cwd(), 'src'),
          ],
          // silences compiler warnings regarding deprecation warnings
          quietDeps: true,
        },
      },
    },
  ];
}

const config: Configuration = {
  entry: {
    app: path.resolve(__dirname, '../../shell/index'),
    /**
     * The entry points for the Paragon theme CSS. Example: ```
     * {
     *   "paragon.theme.core": "/path/to/node_modules/@openedx/paragon/dist/core.min.css",
     *   "paragon.theme.variants.light": "/path/to/node_modules/@openedx/paragon/dist/light.min.css"
     * }
     */
    ...getParagonEntryPoints(paragonThemeCss),
    /**
     * The entry points for the brand theme CSS. Example: ```
     * {
     *   "paragon.theme.core": "/path/to/node_modules/@(open)edx/brand/dist/core.min.css",
     *   "paragon.theme.variants.light": "/path/to/node_modules/@(open)edx/brand/dist/light.min.css"
     * }
     */
    ...getParagonEntryPoints(brandThemeCss),
  },
  output: {
    path: path.resolve(process.cwd(), './dist'),
    publicPath: PUBLIC_PATH,
    uniqueName: 'mf-shell',
  },
  resolve: {
    alias: {
      ...aliases,
      'site.config': path.resolve(process.cwd(), './site.config.dev'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  ignoreWarnings: [
    // Ignore warnings raised by source-map-loader.
    // some third party packages may ship miss-configured sourcemaps, that interrupts the build
    // See: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1780169
    (warning: WebpackError) => !!(
      warning.module
      // @ts-ignore
      && warning.module.resource.includes('node_modules')
      && warning.details
      && warning.details.includes('source-map-loader')),
  ],
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    // Specify file-by-file rules to Webpack. Some file-types need a particular kind of loader.
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          [
            /src/,
            path.resolve(process.cwd(), './site.config.dev.tsx'),
          ]
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
      // We are not extracting CSS from the javascript bundles in development because extracting
      // prevents hot-reloading from working, it increases build time, and we don't care about
      // flash-of-unstyled-content issues in development.
      {
        test: /(.scss|.css)$/,
	oneOf: [
          {
            resource: /(@openedx\/paragon|@(open)?edx\/brand)/,
            use: [
              MiniCssExtractPlugin.loader,
              ...getStyleUseConfig(),
            ],
          },
          {
            use: [
              require.resolve('style-loader'), // creates style nodes from JS strings
              ...getStyleUseConfig(),
            ],
          },
        ],
      },
      // Webpack, by default, uses the url-loader for images and fonts that are required/included by
      // files it processes, which just base64 encodes them and inlines them in the javascript
      // bundles. This makes the javascript bundles ginormous and defeats caching so we will use the
      // file-loader instead to copy the files directly to the output directory.
      {
        test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: require.resolve('file-loader'),
      },
      {
        test: /favicon.ico$/,
        loader: require.resolve('file-loader'),
        options: {
          name: '[name].[ext]', // <-- retain original file name
        },
      },
      {
        test: /\.(jpe?g|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
        loader: require.resolve('file-loader'),
      },
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
    // Generates an HTML file in the output directory.
    new HtmlWebpackPlugin({
      inject: true, // Appends script tags linking to the webpack bundles at the end of the body
      template: path.resolve(process.cwd(), 'public/index.html'),
      chunks: ['app'],
      FAVICON_URL: process.env.FAVICON_URL || null,
      OPTIMIZELY_PROJECT_ID: process.env.OPTIMIZELY_PROJECT_ID || null,
      NODE_ENV: process.env.NODE_ENV || null,
    }),
    new ReactRefreshWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'shell',
      shared: getSharedDependencies({ isShell: true }),
    })
  ],
  // This configures webpack-dev-server which serves bundles from memory and provides live
  // reloading.

  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT || 8080,
    historyApiFallback: {
      index: path.join(PUBLIC_PATH, 'index.html'),
      disableDotRule: true,
    },
    // Enable hot reloading server. It will provide WDS_SOCKET_PATH endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    webSocketServer: 'ws',
    devMiddleware: {
      publicPath: PUBLIC_PATH,
    },
  },
};

export default config;
