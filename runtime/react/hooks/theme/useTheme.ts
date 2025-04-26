import {
  useCallback, useEffect, useReducer, useState,
} from 'react';

import { SELECTED_THEME_VARIANT_KEY } from '../../constants';
import { logError } from '../../../logging';
import { themeActions, themeReducer } from '../../reducers';
import { ThemeVariants, ThemeDefaults } from '../../../../types';
import { isEmptyObject } from './utils';

import useThemeCore from './useThemeCore';
import useThemeConfig from './useThemeConfig';
import useThemeVariants from './useThemeVariants';

/**
* Finds the default theme variant from the given theme variants object. If no default theme exists, the light theme
* variant is returned as a fallback.
*
* It prioritizes:
*   1. A persisted theme variant from localStorage.
*   2. A system preference (`prefers-color-scheme`).
*   3. The configured default theme variant.
*
* Returns the default theme variant, or `undefined` if no valid theme variant is found.
*/
export const getDefaultThemeVariant = (themeVariants: ThemeVariants | undefined, themeDefaults: ThemeDefaults = {}) => {
  if (!themeVariants) {
    return undefined;
  }

  const themeVariantKeys = Object.keys(themeVariants);

  // If there is only one theme variant, return it since it's the only one that may be used.
  if (themeVariantKeys.length === 1) {
    const themeVariantKey = themeVariantKeys[0];
    return {
      name: themeVariantKey,
      metadata: themeVariants[themeVariantKey],
    };
  }

  // Prioritize persisted localStorage theme variant preference.
  const persistedSelectedThemeVariant = localStorage.getItem(SELECTED_THEME_VARIANT_KEY);
  if (persistedSelectedThemeVariant && themeVariants[persistedSelectedThemeVariant]) {
    return {
      name: persistedSelectedThemeVariant,
      metadata: themeVariants[persistedSelectedThemeVariant],
    };
  }

  // Then, detect system preference via `prefers-color-scheme` media query and use
  // the default dark theme variant, if one exists.
  const hasDarkSystemPreference = !!window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  const defaultDarkThemeVariant = themeDefaults.dark ?? 'dark';
  const darkThemeVariantMetadata = themeVariants[defaultDarkThemeVariant];

  if (hasDarkSystemPreference && defaultDarkThemeVariant && darkThemeVariantMetadata) {
    return {
      name: defaultDarkThemeVariant,
      metadata: darkThemeVariantMetadata,
    };
  }

  const defaultLightThemeVariant = themeDefaults.light ?? 'light';
  const lightThemeVariantMetadata = themeVariants[defaultLightThemeVariant];

  // Handle edge case where the default light theme variant is not configured or provided.
  if (!lightThemeVariantMetadata) {
    return undefined;
  }

  // Otherwise, fallback to using the default light theme variant as configured.
  return {
    name: defaultLightThemeVariant,
    metadata: lightThemeVariantMetadata,
  };
};

/**
 * A custom React hook that manages the application's theme state and injects the appropriate CSS for the theme core
 * and theme variants (e.g., light and dark modes) into the HTML document. It handles dynamically loading the theme
 * CSS based on the current theme variant, and ensures that the theme variant's CSS is preloaded for runtime theme
 * switching. This is done using "alternate" stylesheets. That is, the browser will download the CSS for the
 * non-current theme variants with a lower priority than the current one.
 *
 * The hook also responds to system theme preference changes (e.g., via the `prefers-color-scheme` media query),
 * and can automatically switch the theme based on the system's dark mode or light mode preference.
 *
 * * @example
 * const [themeState, dispatch] = useTheme();
 * console.log(themeState.isThemeLoaded); // true when the theme has been successfully loaded.
 *
 * // Dispatch an action to change the theme variant
 * dispatch(themeActions.setThemeVariant('dark'));
 */
const useTheme = () => {
  const themeConfig = useThemeConfig();
  const {
    core: themeCore,
    defaults: themeVariantDefaults,
    variants: themeVariants,
  } = themeConfig;
  const initialThemeState = {
    isThemeLoaded: false,
    themeVariant: getDefaultThemeVariant(themeVariants, themeVariantDefaults)?.name,
  };
  const [themeState, dispatch] = useReducer(themeReducer, initialThemeState);

  const [isThemeCoreLoaded, setIsThemeCoreLoaded] = useState(false);
  const onLoadThemeCore = useCallback(() => {
    setIsThemeCoreLoaded(true);
  }, []);

  const [hasLoadedThemeVariants, setHasLoadedThemeVariants] = useState(false);
  const onLoadThemeVariants = useCallback(() => {
    setHasLoadedThemeVariants(true);
  }, []);

  // load the theme's core CSS
  useThemeCore({
    themeCore,
    onComplete: onLoadThemeCore,
  });

  // respond to system preference changes with regard to `prefers-color-scheme: dark`.
  const handleDarkModeSystemPreferenceChange = useCallback((prefersDarkMode: boolean) => {
    // Ignore system preference change if the theme variant is already set in localStorage.
    if (localStorage.getItem(SELECTED_THEME_VARIANT_KEY)) {
      return;
    }

    if (prefersDarkMode && themeVariantDefaults?.dark) {
      dispatch(themeActions.setThemeVariant(themeVariantDefaults.dark));
    } else if (!prefersDarkMode && themeVariantDefaults?.light) {
      dispatch(themeActions.setThemeVariant(themeVariantDefaults.light));
    } else {
      logError(`Could not set theme variant based on system preference (prefers dark mode: ${prefersDarkMode})`);
    }
  }, [themeVariantDefaults]);

  // load the theme variant(s) CSS
  useThemeVariants({
    themeVariants,
    onComplete: onLoadThemeVariants,
    currentThemeVariant: themeState.themeVariant,
    onDarkModeSystemPreferenceChange: handleDarkModeSystemPreferenceChange,
  });

  useEffect(() => {
    // theme is already loaded, do nothing
    if (themeState.isThemeLoaded) {
      return;
    }

    const hasThemeConfig = (themeCore?.url && !isEmptyObject(themeVariants));
    if (!hasThemeConfig) {
      // no theme URLs to load, set loading to false.
      dispatch(themeActions.setThemeLoaded(true));
    }

    // Return early if neither the core theme CSS nor any theme variant CSS is loaded.
    if (!isThemeCoreLoaded || !hasLoadedThemeVariants) {
      return;
    }

    // All application theme URLs are loaded
    dispatch(themeActions.setThemeLoaded(true));
  }, [
    themeState.isThemeLoaded,
    isThemeCoreLoaded,
    hasLoadedThemeVariants,
    themeCore?.url,
    themeVariants,
  ]);

  return [themeState, dispatch];
};

export default useTheme;
