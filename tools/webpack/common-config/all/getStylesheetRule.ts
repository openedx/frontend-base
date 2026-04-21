import PostCssAutoprefixerPlugin from 'autoprefixer';
import CssNano from 'cssnano';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import PostCssCustomMediaCSS from 'postcss-custom-media';
import PostCssRTLCSS from 'postcss-rtlcss';
import { RuleSetRule } from 'webpack';
import postcssWrapLayer from './postcssWrapLayer';

/*
 * Resource matchers for each cascade layer.
 * Order declared at the site level: `paragon, shell, app, site, brand` (later wins).
 *
 * - paragon: @openedx/paragon base styles.  First so everything else can override.
 * - shell:   frontend-base shell styles.
 * - app:     catch-all for any other stylesheet pulled from node_modules.
 *            Keeps apps from clobbering site or brand overrides without requiring
 *            app packages to follow any naming convention or self-declaration.
 * - site:    the composing site's own source tree (anything outside node_modules).
 * - brand:   @openedx/brand-* packages, last so build-time brand matches the
 *            precedence of runtime brand CSS (which is injected unlayered via
 *            <link> tags and thus beats every layered rule).
 */
const PARAGON_RESOURCE = /@openedx[\\/]paragon[\\/]/;
const SHELL_RESOURCE = /(@openedx[\\/]frontend-base|frontend-base[\\/]shell)[\\/]/;
const BRAND_RESOURCE = /@(open)?edx[\\/]brand(-[^\\/]+)?[\\/]/;
const NODE_MODULES = /[\\/]node_modules[\\/]/;

/*
 * There are a few things we need to do here.
 *
 * - We only want to use MiniCssExtractPlugin on dependencies in dev, but not on our source code.
 * - We only want CssNano in production.
 * - Each resource class (paragon, shell, app, site, brand) is wrapped in its
 *   own cascade layer by a PostCSS plugin so the cascade order is
 *   `paragon, shell, app, site, brand`.
 */
export default function getStylesheetRule(mode: 'dev' | 'production'): RuleSetRule {
  return {
    test: /(.scss|.css)$/,
    oneOf: [
      {
        resource: PARAGON_RESOURCE,
        // We need Paragon to not elide CSS: we have to be able to import it
        // directly from shell/style.ts
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader,
          ...getStyleUseConfig(mode, 'paragon'),
        ],
      },
      {
        resource: SHELL_RESOURCE,
        use: [
          MiniCssExtractPlugin.loader,
          ...getStyleUseConfig(mode, 'shell'),
        ],
      },
      {
        resource: BRAND_RESOURCE,
        use: [
          MiniCssExtractPlugin.loader,
          ...getStyleUseConfig(mode, 'brand'),
        ],
      },
      {
        resource: { not: [NODE_MODULES] },
        use: [
          getFirstLoader(mode),
          ...getStyleUseConfig(mode, 'site'),
        ],
      },
      {
        use: [
          getFirstLoader(mode),
          ...getStyleUseConfig(mode, 'app'),
        ],
      },
    ],
  };
}

function getFirstLoader(mode: 'dev' | 'production') {
  // In dev we keep site/app styles in JS bundles so hot-reloading works;
  // in production everything is extracted to CSS files.
  if (mode === 'production') {
    return MiniCssExtractPlugin.loader;
  }
  return require.resolve('style-loader');
}

function getStyleUseConfig(mode: 'dev' | 'production', layer: string) {
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
          plugins: getPostCssLoaderPlugins(mode, layer),
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
          // Silences compiler deprecation warnings.  They mostly come from bootstrap and/or paragon.
          quietDeps: true,
          silenceDeprecations: ['abs-percent', 'color-functions', 'import', 'global-builtin', 'legacy-js-api'],
        },
      },
    },
  ];
}

function getPostCssLoaderPlugins(mode: 'dev' | 'production', layer: string) {
  const plugins: any[] = [
    PostCssAutoprefixerPlugin({
      remove: false, // Prevents removing vendor prefixes
    }),
    PostCssRTLCSS(),
  ];

  // We want CSSNano third, and only in production.
  if (mode === 'production') {
    plugins.push(CssNano());
  }

  plugins.push(PostCssCustomMediaCSS());
  plugins.push(postcssWrapLayer({ layer }));
  return plugins;
}
