import { useMemo } from 'react';

import { Theme } from '../../../../types';
import { getSiteConfig } from '../../../config';
import { isEmptyObject } from './utils';

/**
 * Custom React hook that retrieves the theme configuration.
 *
 * Configuration is considered entirely invalid if it doesn't define at least one variant, including core.
 *
 * Example:
 *
 * const themeConfig = useThemeConfig();
 * if (themeConfig) {
 *   console.log(themeConfig.core.url); // Outputs the URL of theme's core CSS
 *   console.log(themeConfig.variants['dark'].url); // Outputs the URL of the theme's dark variant CSS
 * }
 */
const useThemeConfig = (): Theme => useMemo(() => {
  const { theme } = getSiteConfig();

  if (!theme || (isEmptyObject(theme.core) && isEmptyObject(theme.variants))) {
    return {};
  }

  return {
    core: theme.core,
    defaults: theme.defaults,
    variants: theme.variants,
  };
}, []);

export default useThemeConfig;
