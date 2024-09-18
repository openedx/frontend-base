import { defaultConfigPaths } from '../defaultConfigPaths';
import { ConfigTypes } from '../types';

export default function getBaseConfig(configType: ConfigTypes) {
  const configPaths = defaultConfigPaths[configType];
  if (configPaths === undefined) {
    throw new Error(`openedx: ${configType} is not a supported config type.`);
  }

  return require(require.resolve(configPaths[configPaths.length - 1]))
};
