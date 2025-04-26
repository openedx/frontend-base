import { renderHook } from '@testing-library/react';

import useThemeConfig from './useThemeConfig';
import * as config from '../../../config';

const baseSiteConfig = config.getSiteConfig();

describe('useThemeConfig', () => {
  afterEach(() => {
    jest.spyOn(config, 'getSiteConfig').mockRestore();
    jest.resetAllMocks();
  });

  it.each([
    [undefined, {}],
    [{}, {}],
  ])('handles when `siteConfig.theme` is not present (%s)', (theme, expectedURLConfig) => {
    jest.spyOn(config, 'getSiteConfig').mockReturnValue({
      ...baseSiteConfig,
      theme
    });
    const { result } = renderHook(() => useThemeConfig());
    expect(result.current).toEqual(expectedURLConfig);
  });

  describe('when `siteConfig.theme` is present', () => {
    it('returns empty object if core is not defined and no variants are defined', () => {
      jest.spyOn(config, 'getSiteConfig').mockReturnValue({
        ...baseSiteConfig,
        theme: {
          core: undefined,
          variants: {}
        },
      });
      const { result } = renderHook(() => useThemeConfig());
      expect(result.current).toStrictEqual({});
    });
    it('returns expected object when only core is defined', () => {
      jest.spyOn(config, 'getSiteConfig').mockReturnValue({
        ...baseSiteConfig,
        theme: {
          core: {
            url: 'core.css',
          },
        },
      });
      const { result } = renderHook(() => useThemeConfig());
      expect(result.current).toStrictEqual({
        core: {
          url: 'core.css',
        },
        defaults: undefined,
        variants: undefined,
      });
    });
    it('returns expected object when only a light variant is defined', () => {
      jest.spyOn(config, 'getSiteConfig').mockReturnValue({
        ...baseSiteConfig,
        theme: {
          variants: {
            light: { url: 'light.css' },
          }
        },
      });
      const { result } = renderHook(() => useThemeConfig());
      expect(result.current).toStrictEqual({
        core: undefined,
        defaults: undefined,
        variants: {
          light: { url: 'light.css' },
        }
      });
    });
    it('returns expected object when configuration is valid', () => {
      jest.spyOn(config, 'getSiteConfig').mockReturnValue({
        ...baseSiteConfig,
        theme: {
          core: {
            url: 'core.css',
          },
          defaults: {
            light: 'light',
          },
          variants: {
            light: {
              url: 'light.css',
            },
          },
        },
      });
      const { result } = renderHook(() => useThemeConfig());
      expect(result.current).toStrictEqual({
        core: {
          url: 'core.css',
        },
        defaults: {
          light: 'light',
        },
        variants: {
          light: {
            url: 'light.css',
          },
        },
      });
    });
  });
});
