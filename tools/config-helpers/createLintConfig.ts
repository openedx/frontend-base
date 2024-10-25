import tseslint, { ConfigWithExtends } from 'typescript-eslint';
import { ConfigTypes } from '../types';
import getBaseConfig from './getBaseConfig';

export default function createLintConfig(...configs: ConfigWithExtends[]) {
  const baseConfig = getBaseConfig(ConfigTypes.LINT);

  return tseslint.config(
    {
      extends: baseConfig,
    },
    ...configs,
  );
};
