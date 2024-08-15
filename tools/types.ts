export interface ConfigPreset {
  defaultFilename: string,
  getDefault: any,
  resolvedFilepath: string,
}

export enum ConfigPresetTypes {
  BABEL = 'babel',
  BUILD = 'build',
  BUILD_MODULE = 'build:module',
  DEV = 'dev',
  DEV_MODULE = 'dev:module',
  LINT = 'lint',
  TEST = 'test',
}

export type ConfigPresets = {
  [key in ConfigPresetTypes]: ConfigPreset
}
