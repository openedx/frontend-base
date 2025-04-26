import { useEffect, useState } from 'react';

import { logError } from '../../../logging';

import { ThemeVariants } from '../../../../types';

/**
 * A custom React hook that manages the loading of theme variant CSS files dynamically.
 * Adds/updates a `<link>` element in the HTML document to load each theme variant's CSS, setting the
 * non-current theme variants as "alternate" stylesheets. That is, the browser will download
 * the CSS for the non-current theme variants, but at a lower priority than the current one.
 * This ensures that if the theme variant is changed at runtime, the new theme's CSS will already be loaded.
 *
 * The hook also listens for changes in the system's preference and triggers the provided callback accordingly.
 */
const useThemeVariants = ({
  themeVariants,
  currentThemeVariant,
  onComplete,
  onDarkModeSystemPreferenceChange,
}: {
  themeVariants: ThemeVariants | undefined,
  currentThemeVariant: string,
  onComplete: () => void,
  onDarkModeSystemPreferenceChange: (prefersDarkMode: boolean) => void,
}) => {
  const [isThemeVariantComplete, setIsThemeVariantComplete] = useState(false);

  // Effect hook that listens for changes in the system's dark mode preference.
  useEffect(() => {
    const changeColorScheme = (colorSchemeQuery) => {
      onDarkModeSystemPreferenceChange(colorSchemeQuery.matches);
    };
    const colorSchemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (colorSchemeQuery) {
      colorSchemeQuery.addEventListener('change', changeColorScheme);
    }
    return () => {
      if (colorSchemeQuery) {
        colorSchemeQuery.removeEventListener('change', changeColorScheme);
      }
    };
  }, [onDarkModeSystemPreferenceChange]);

  // Effect hook to set the theme current variant on the HTML element.
  useEffect(() => {
    if (currentThemeVariant && themeVariants?.[currentThemeVariant]) {
      const htmlDataThemeVariantAttr = 'data-theme-variant';
      document.querySelector('html')?.setAttribute(htmlDataThemeVariantAttr, currentThemeVariant);
      return () => {
        document.querySelector('html')?.removeAttribute(htmlDataThemeVariantAttr);
      };
    }
    return () => { }; // Cleanup: no action needed when theme variant is not set
  }, [themeVariants, currentThemeVariant]);

  // Effect hook that calls `onComplete` when brand theme variant processing is complete.
  useEffect(() => {
    if (isThemeVariantComplete) {
      onComplete();
    }
  }, [isThemeVariantComplete, onComplete]);

  useEffect(() => {
    if (!themeVariants) {
      return;
    }

    /**
     * Determines the value for the `rel` attribute for a given theme variant based
     * on if its the currently applied variant.
     */
    const getActiveOrAlternateRel = (themeVariant: string): string => (currentThemeVariant === themeVariant ? 'stylesheet' : 'alternate stylesheet');

    // Iterate over each theme variant URLs and inject them into the HTML document, if each doesn't already exist.
    Object.entries(themeVariants).forEach(([themeVariant, { url }]) => {
      // If the config for the theme variant does not have a URL, set the variant to complete and continue.
      if (!url) {
        setIsThemeVariantComplete(true);
        return;
      }

      const existingThemeVariantLink: HTMLAnchorElement | null = document.head.querySelector(`link[href='${url}']`);
      if (existingThemeVariantLink) {
        existingThemeVariantLink.rel = getActiveOrAlternateRel(themeVariant);
        existingThemeVariantLink.dataset.themeVariant = themeVariant;
        return;
      }

      const themeVariantLink = document.createElement('link');
      themeVariantLink.href = url;
      themeVariantLink.rel = getActiveOrAlternateRel(themeVariant);
      themeVariantLink.dataset.themeVariant = themeVariant;

      themeVariantLink.onload = () => {
        if (themeVariant === currentThemeVariant) {
          setIsThemeVariantComplete(true);
        }
      };

      themeVariantLink.onerror = () => {
        logError(`Failed to load theme variant (${themeVariant}) CSS from ${url}. Aborting.`);
        setIsThemeVariantComplete(true);
      };

      document.head.insertAdjacentElement(
        'beforeend',
        themeVariantLink,
      );

      setIsThemeVariantComplete(true);
    });
  }, [themeVariants, currentThemeVariant, onComplete]);
};

export default useThemeVariants;
