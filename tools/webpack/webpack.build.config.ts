// This is the prod Webpack config. All settings here should prefer smaller,
// optimized bundles at the expense of a longer build time.

import { transform } from '@formatjs/ts-transformer';
import { ModuleFederationPlugin } from '@module-federation/enhanced';
import PostCssAutoprefixerPlugin from 'autoprefixer';
import CssNano from 'cssnano';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import PostCssCustomMediaCSS from 'postcss-custom-media';
import PostCssRTLCSS from 'postcss-rtlcss';
import { Configuration, WebpackError } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import 'webpack-dev-server'; // Required to get devServer types added to Configuration

import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

import ParagonWebpackPlugin from '../lib/plugins/paragon-webpack-plugin/ParagonWebpackPlugin';
import {
  getParagonCacheGroups,
  getParagonEntryPoints,
  getParagonThemeCss,
} from './data/paragonUtils';
import getLocalAliases from './getLocalAliases';
import getSharedDependencies from './getSharedDependencies';

const paragonThemeCss = getParagonThemeCss(process.cwd());
const brandThemeCss = getParagonThemeCss(process.cwd(), { isBrandOverride: true });

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

const aliases = getLocalAliases();

const config: Configuration = {
  mode: 'production',
  devtool: 'source-map',
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
    filename: '[name].[chunkhash].js',
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: PUBLIC_PATH,
    clean: true, // Clean the output directory before emit.
    uniqueName: 'mf-shell',
  },
  resolve: {
    alias: {
      ...aliases,
      'site.config': path.resolve(process.cwd(), './site.config.build'),
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
  module: {
    // Specify file-by-file rules to Webpack. Some file-types need a particular kind of loader.
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          /src/,
          path.resolve(process.cwd(), './site.config.build.tsx'),
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
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          require.resolve('source-map-loader'),
        ],
        enforce: 'pre',
      },
      // Webpack, by default, includes all CSS in the javascript bundles. Unfortunately, that means:
      // a) The CSS won't be cached by browsers separately (a javascript change will force CSS
      // re-download).  b) Since CSS is applied asynchronously, it causes an ugly
      // flash-of-unstyled-content.
      //
      // To avoid these problems, we extract the CSS from the bundles into separate CSS files that
      // can be included as <link> tags in the HTML <head> manually.
      //
      // We will not do this in development because it prevents hot-reloading from working and it
      // increases build time.
      {
        test: /(.scss|.css)$/,
        use: [
          MiniCssExtractPlugin.loader,
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
                  CssNano(),
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
  // New in Webpack 4. Replaces CommonChunksPlugin. Extract common modules among all chunks to one
  // common chunk and extract the Webpack runtime to a single runtime chunk.
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        ...getParagonCacheGroups(paragonThemeCss),
        ...getParagonCacheGroups(brandThemeCss),
      },
    },
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              ...['png', 'jpeg', 'jpg'].reduce((accumulator, value) => (
                { ...accumulator, [value]: { progressive: true, quality: 65 } }
              ), {}),
              gif: {
                effort: 5,
              },
            },
          },
        },
      }),
    ],
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
    // Generates an HTML file in the output directory.
    new HtmlWebpackPlugin({
      inject: true, // Appends script tags linking to the webpack bundles at the end of the body
      template: path.resolve(process.cwd(), 'public/index.html'),
      chunks: ['app'],
      FAVICON_URL: process.env.FAVICON_URL || null,
      OPTIMIZELY_PROJECT_ID: process.env.OPTIMIZELY_PROJECT_ID || null,
      NODE_ENV: process.env.NODE_ENV || null,
      SITE_NAME: process.env.SITE_NAME || '',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new ModuleFederationPlugin({
      name: 'shell',
      shared: getSharedDependencies({ isShell: true })
    })
  ],
};

export default config;
