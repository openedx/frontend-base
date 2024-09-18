import { merge } from 'webpack-merge';
import { ConfigTypes } from '../types';
import getBaseConfig from './getBaseConfig';

export default function createConfig(configType: ConfigTypes, configFragment: any = {}) {
  const baseConfig = getBaseConfig(configType);
  return merge(baseConfig, configFragment);
};
