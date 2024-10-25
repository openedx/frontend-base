import ImageMinimizerPlugin, { Compiler } from 'image-minimizer-webpack-plugin';
import { WebpackPluginInstance } from 'webpack';

// This is pulled from the definition of optimization.minimizer in the webpack Configuration type.
type ImageMinimizerReturnType = (false | '' | 0 | '...' | ((this: Compiler, compiler: Compiler) => void) | WebpackPluginInstance | null | undefined)[] | undefined;

export default function getImageMinimizer(): ImageMinimizerReturnType {
  return [
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
  ]
}
