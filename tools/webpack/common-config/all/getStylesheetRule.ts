import PostCssAutoprefixerPlugin from 'autoprefixer';
import CssNano from 'cssnano';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import PostCssCustomMediaCSS from 'postcss-custom-media';
import PostCssRTLCSS from 'postcss-rtlcss';
import { RuleSetRule } from 'webpack';

/**
 * There are a few things we need to do here.
 *
 * - We only want to use MiniCssExtractPlugin on dependencies in dev, but not on our source code.
 * - We only want CssNano in production.
 */
export default function getStylesheetRule(mode: 'dev' | 'production'): RuleSetRule {
  if (mode === 'production') {
    // In the production case, all files should go through MiniCssExtractPlugin.
    return {
      test: /(.scss|.css)$/,
      use: [
        MiniCssExtractPlugin.loader,
        ...getStyleUseConfig(mode),
      ],
    }
  } else {
    // In the dev case, only our @openedx dependencies go through MiniCssExtractPlugin.
    // We are not extracting CSS from the javascript bundles in development because extracting
    // prevents hot-reloading from working, it increases build time, and we don't care about
    // flash-of-unstyled-content issues in development.
    return {
      test: /(.scss|.css)$/,
      oneOf: [
        {
          resource: /(@openedx\/paragon|@(open)?edx\/brand)/,
          use: [
            MiniCssExtractPlugin.loader,
            ...getStyleUseConfig(mode),
          ],
        },
        {
          use: [
            require.resolve('style-loader'), // creates style nodes from JS strings
            ...getStyleUseConfig(mode),
          ],
        },
      ]
    }
  }

}

function getStyleUseConfig(mode: 'dev' | 'production') {
  return [
    {
      loader: require.resolve('css-loader'), // translates CSS into CommonJS
      options: {
        sourceMap: true,
        modules: {
          // namedExport defaults to true in css-loader v7, but we rely on the old behavior.
          // Details here:
          // https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md#700-2024-04-04
          namedExport: false,
          mode: 'icss',
        },
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: getPostCssLoaderPlugins(mode), // Different behavior for dev and production.
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
  ]
}

/**
 * This exists just to conditionally include CssNano in production.
 */
function getPostCssLoaderPlugins(mode: 'dev' | 'production') {
  const plugins: any[] = [
    PostCssAutoprefixerPlugin(),
    PostCssRTLCSS(),
  ];

  // We want CSSNano third, and only in production.
  if (mode === 'production') {
    plugins.push(CssNano());
  }

  plugins.push(PostCssCustomMediaCSS());
  return plugins;
}
