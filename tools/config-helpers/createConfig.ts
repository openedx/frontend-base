import { merge } from 'webpack-merge';
import { ConfigPresetTypes } from '../types';
import getBaseConfig from './getBaseConfig';

export default function createConfig(commandName: ConfigPresetTypes, configFragment: any = {}) {
  const baseConfig = getBaseConfig(commandName);
  return merge(baseConfig, configFragment);
};
