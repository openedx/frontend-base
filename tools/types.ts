export enum ConfigTypes {
  BABEL = 'babel',
  WEBPACK_BUILD = 'webpack-build',
  WEBPACK_BUILD_MODULE = 'webpack-build-module',
  WEBPACK_DEV = 'webpack-dev',
  WEBPACK_DEV_MODULE = 'webpack-dev-module',
  WEBPACK_DEV_LEGACY = 'webpack-dev-legacy',
  WEBPACK_DEV_SHELL = 'webpack-dev-shell',
  LINT = 'lint',
  TEST = 'test',
}

export enum CommandTypes {
  RELEASE = 'release',
  PACK = 'pack',
  LINT = 'lint',
  TEST = 'test',
  BUILD = 'build',
  BUILD_MODULE = 'build:module',
  DEV_MODULE = 'dev:module',
  DEV_LEGACY = 'dev:legacy',
  DEV_SHELL = 'dev:shell',
  DEV = 'dev',
  FORMAT_JS = 'formatjs',
  SERVE = 'serve',
  HELP = 'help',
}
