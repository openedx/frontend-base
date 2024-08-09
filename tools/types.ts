export interface ConfigPreset {
  defaultFilename: string,
  getDefault: any,
  resolvedFilepath: string,
}

export enum ConfigPresetTypes {
  BABEL = 'babel',
  ESLINT = 'eslint',
  JEST = 'jest',
  WEBPACK = 'webpack',
  WEBPACK_DEV_SERVER = 'webpack-dev-server',
  SHELL_DEV_SERVER = 'shell-dev-server',
  WEBPACK_DEV_SERVER_STAGE = 'webpack-dev-server-stage',
  WEBPACK_PROD = 'webpack-prod',
}

export type ConfigPresets = {
  [key in ConfigPresetTypes]: ConfigPreset
}
