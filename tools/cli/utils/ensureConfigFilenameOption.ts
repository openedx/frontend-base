import path from 'path';
import { ConfigTypes } from '../../types';
import getResolvedConfigPath from './getResolvedConfigPath';

export function ensureConfigFilenameOption(configType: ConfigTypes, keys: string[]) {
  let configFileName = null;
  let fileNameIndex = null;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const index = process.argv.indexOf(key);
    if (index !== -1) {
      fileNameIndex = index + 1;
      if (process.argv.length > fileNameIndex) {
        configFileName = process.argv[fileNameIndex];
      } else {
        console.error(`You must specify a config filename as the next argument when using the ${key} flag. Aborting.`);
        process.exit(1);
      }
    }
  }

  let customConfigFilePath = null;
  if (configFileName !== null) {
    customConfigFilePath = path.resolve(process.cwd(), configFileName);
  }

  const resolvedConfigPath = getResolvedConfigPath(customConfigFilePath, configType);

  if (resolvedConfigPath === null) {
    console.error(`No valid config file was found. Did you forget to create a config file? You may specify a custom path with the ${keys.join(' or ')} flag(s).`);
    process.exit(1);
  }

  // If there wasn't a config flag on the command line, add one.
  if (fileNameIndex === null) {
    process.argv.push(keys[0]);
    process.argv.push(resolvedConfigPath);
  } else {
    process.argv[fileNameIndex] = resolvedConfigPath;
  }
}
