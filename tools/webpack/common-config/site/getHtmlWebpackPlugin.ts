import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

// Generates an HTML file in the output directory.
export default function getHtmlWebpackPlugin() {
  return new HtmlWebpackPlugin({
    inject: true, // Appends script tags linking to the webpack bundles at the end of the body
    template: path.resolve(process.cwd(), 'public/index.html'),
    chunks: ['app'],
  });
}
