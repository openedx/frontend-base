export default function getFileLoaderRules() {
  return [
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
  ]
}
