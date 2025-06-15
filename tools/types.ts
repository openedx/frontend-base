export enum ConfigTypes {
  BABEL = 'babel',
  WEBPACK_BUILD = 'webpack-build',
  WEBPACK_DEV = 'webpack-dev',
  WEBPACK_DEV_STANDALONE = 'webpack-dev-standalone',
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
  DEV_STANDALONE = 'dev:standalone',
  DEV_SHELL = 'dev:shell',
  DEV = 'dev',
  FORMAT_JS = 'formatjs',
  SERVE = 'serve',
  HELP = 'help',
}
