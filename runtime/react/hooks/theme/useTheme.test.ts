import { act, fireEvent, renderHook } from '@testing-library/react';

import useTheme from './useTheme';
import * as config from '../../../config';
import { logError } from '../../../logging';

jest.mock('../../../logging');

const baseSiteConfig = config.getSiteConfig();

const theme = {
  core: {
    url: 'https://cdn.jsdelivr.net/npm/@openedx/brand@1.0.0/dist/core.min.css',
  },
  defaults: {
    light: 'light',
    dark: 'dark',
  },
  variants: {
    light: {
      url: 'https://cdn.jsdelivr.net/npm/@openedx/brand@1.0.0/dist/light.min.css',
    },
    dark: {
      url: 'https://cdn.jsdelivr.net/npm/@openedx/brand@1.0.0/dist/dark.min.css',
    },
  },
};

let mockMediaQueryListEvent;
const mockAddEventListener = jest.fn((_, fn) => fn(mockMediaQueryListEvent));
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    matches: mockMediaQueryListEvent.matches,
  })),
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
  },
});

describe('useTheme', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    mockMediaQueryListEvent = { matches: true };
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    jest.mocked(window.localStorage.getItem).mockClear();
  });

  afterEach(() => {
    jest.spyOn(config, 'getSiteConfig').mockRestore();
  });

  it.each([
    ['dark', 'stylesheet', 'alternate stylesheet', true], // preference is dark
    ['light', 'alternate stylesheet', 'stylesheet', false], // preference is light
  ])(
    'should configure theme variant for system preference %s and handle theme change events',
    (initialPreference, expectedDarkRel, expectedLightRel, isDarkMediaMatch) => {
      jest.spyOn(config, 'getSiteConfig').mockReturnValue({
        ...baseSiteConfig,
        theme
      });
      // Mock the matchMedia behavior to simulate system preference
      mockMediaQueryListEvent = { matches: isDarkMediaMatch };
      // Set up the hook and initial theme configuration
      const { result, unmount } = renderHook(() => useTheme());
      const themeLinks = document.head.querySelectorAll('link');

      const checkThemeLinks = () => {
        const darkLink: HTMLAnchorElement | null = document.head.querySelector('link[data-theme-variant="dark"]');
        const lightLink: HTMLAnchorElement | null = document.head.querySelector('link[data-theme-variant="light"]');
        expect(darkLink?.rel).toBe(expectedDarkRel);
        expect(lightLink?.rel).toBe(expectedLightRel);
      };

      // Simulate initial theme configuration based on system preference
      act(() => {
        themeLinks.forEach((link) => fireEvent.load(link));
      });

      // Ensure matchMedia was called with the correct system preference
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mockAddEventListener).toHaveBeenCalled();

      // Check initial theme setup
      checkThemeLinks();
      expect(result.current[0]).toEqual({
        isThemeLoaded: true,
        themeVariant: initialPreference,
      });

      unmount();
      expect(mockRemoveEventListener).toHaveBeenCalled();
    },
  );

  it('should configure theme variants according with user preference if is defined (localStorage)', () => {
    jest.spyOn(config, 'getSiteConfig').mockReturnValue({
      ...baseSiteConfig,
      theme
    });
    jest.mocked(window.localStorage.getItem).mockReturnValue('light');
    const { result, unmount } = renderHook(() => useTheme());
    const themeLinks = document.head.querySelectorAll('link');
    const darkLink: HTMLAnchorElement | null = document.head.querySelector('link[data-theme-variant="dark"]');
    const lightLink: HTMLAnchorElement | null = document.head.querySelector('link[data-theme-variant="light"]');

    act(() => {
      themeLinks.forEach((link) => fireEvent.load(link));
    });

    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(mockAddEventListener).toHaveBeenCalled();

    expect(darkLink?.rel).toBe('alternate stylesheet');
    expect(lightLink?.rel).toBe('stylesheet');
    expect(result.current[0]).toEqual({ isThemeLoaded: true, themeVariant: 'light' });

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });

  it('should define the theme variant as default if only 1 is configured', () => {
    jest.spyOn(config, 'getSiteConfig').mockReturnValue({
      ...baseSiteConfig,
      theme: { ...theme, variants: { light: theme.variants.light } }
    });
    jest.mocked(window.localStorage.getItem).mockReturnValue('light');
    const { result, unmount } = renderHook(() => useTheme());
    const themeLinks = document.head.querySelectorAll('link');
    const themeVariantLinks: NodeListOf<HTMLAnchorElement> | null = document.head.querySelectorAll('link[data-theme-variant]');

    act(() => {
      themeLinks.forEach((link) => fireEvent.load(link));
    });

    expect(themeVariantLinks.length).toBe(1);
    expect((themeVariantLinks[0]).rel).toBe('stylesheet');
    expect(result.current[0]).toEqual({ isThemeLoaded: true, themeVariant: 'light' });

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });

  it('should not configure any theme if theme is undefined', () => {
    const { result, unmount } = renderHook(() => useTheme());
    const themeLinks = document.head.querySelectorAll('link');

    expect(result.current[0]).toEqual({ isThemeLoaded: true, themeVariant: undefined });
    expect(themeLinks.length).toBe(0);
    unmount();
  });

  it('should return themeVariant undefined if a default variant cannot be configured', () => {
    jest.spyOn(config, 'getSiteConfig').mockReturnValue({
      ...baseSiteConfig,
      theme: {
        ...theme,
        defaults: {
          light: 'red'
        },
        variants: {
          light: theme.variants.light,
          green: { url: 'green-url' }
        }
      }
    });
    jest.mocked(window.localStorage.getItem).mockReturnValue(null);

    const { result, unmount } = renderHook(() => useTheme());
    const themeLinks = document.head.querySelectorAll('link');
    const themeVariantLinks = document.head.querySelectorAll('link[data-theme-variant]');
    act(() => {
      themeLinks.forEach((link) => fireEvent.load(link));
    });

    expect(result.current[0]).toEqual({ isThemeLoaded: true, themeVariant: undefined });
    expect(themeLinks.length).toBe(3);
    themeVariantLinks.forEach((link: HTMLAnchorElement) => expect(link.rel).toBe('alternate stylesheet'));
    unmount();
  });

  it('should log an error if the preferred theme variant cannot be set', async () => {
    jest.spyOn(config, 'getSiteConfig').mockReturnValue({
      ...baseSiteConfig,
      theme: {
        ...theme,
        defaults: {
          light: 'light',
          dark: 'dark'
        },
        variants: {
          light: theme.variants.light,
          green: { url: 'green-url' }
        }
      }
    });
    jest.mocked(window.localStorage.getItem).mockReturnValue(null);

    const { result, unmount } = renderHook(() => useTheme());
    const themeLinks = document.head.querySelectorAll('link');
    const themeVariantLinks = document.head.querySelectorAll('link[data-theme-variant]');

    act(() => {
      themeLinks.forEach((link) => fireEvent.load(link));
    });

    expect(result.current[0]).toEqual({ isThemeLoaded: true, themeVariant: 'dark' });
    expect(logError).toHaveBeenCalled();
    expect(themeVariantLinks.length).toBe(2);
    themeVariantLinks.forEach((link: HTMLAnchorElement) => expect(link.rel).toBe('alternate stylesheet'));
    unmount();
  });
});
