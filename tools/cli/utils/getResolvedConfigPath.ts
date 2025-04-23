import fs from 'fs';
import { defaultConfigPaths } from '../../defaultConfigPaths';
import { ConfigTypes } from '../../types';

export default function getResolvedConfigPath(customConfigPath: string | null, configType: ConfigTypes) {
  const configPaths = defaultConfigPaths[configType];

  if (customConfigPath !== null) {
    if (fs.existsSync(customConfigPath)) {
      return customConfigPath;
    } else {
      console.error(`The custom config file at ${customConfigPath} does not exist. Aborting.`);
      return null;
    }
  } else {
    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }
  }
  return null;
}
