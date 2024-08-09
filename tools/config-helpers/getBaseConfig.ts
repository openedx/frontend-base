import { ConfigPresetTypes } from '../types';
import presets from './presets';

export default function getBaseConfig(commandName: ConfigPresetTypes) {
  if (presets[commandName] === undefined) {
    throw new Error(`openedx: ${commandName} is not a supported command.`);
  }

  return presets[commandName].getDefault();
};
