import { WebpackError } from 'webpack';

export default function getIgnoreWarnings() {
  return [
    // Ignore warnings raised by source-map-loader.
    // some third party packages may ship miss-configured sourcemaps, that interrupts the build
    // See: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1780169
    (warning: WebpackError) => !!(
      // @ts-expect-error 'resource' is something TypeScript can't find for whatever reason.
      warning.module?.resource.includes('node_modules')
      && warning.details?.includes('source-map-loader')),
  ];
}
