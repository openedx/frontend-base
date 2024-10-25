import { WebpackError } from 'webpack';

export default function getIgnoreWarnings() {
  return [
    // Ignore warnings raised by source-map-loader.
    // some third party packages may ship miss-configured sourcemaps, that interrupts the build
    // See: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1780169
    (warning: WebpackError) => !!(
      warning.module
      // @ts-ignore
      && warning.module.resource.includes('node_modules')
      && warning.details
      && warning.details.includes('source-map-loader')),
  ]
}
