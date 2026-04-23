import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

/*
 * Generates an HTML file in the output directory.
 *
 * `cssLayerOrder` is listed first so its <link> is injected before any other
 * stylesheet. That file contains the `@layer paragon, shell, app, site, brand;`
 * statement, which locks in cascade-layer priority before any layer name is
 * mentioned by the rest of the CSS the browser parses.
 */
export default function getHtmlWebpackPlugin() {
  return new HtmlWebpackPlugin({
    inject: true,
    template: path.resolve(process.cwd(), 'public/index.html'),
    chunks: ['cssLayerOrder', 'app'],
    chunksSortMode: 'manual',
  });
}
