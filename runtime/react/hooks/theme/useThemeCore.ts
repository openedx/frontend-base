import { useEffect, useState } from 'react';

import { logError } from '../../../logging';
import { removeExistingLinks } from './utils';

/**
 * Custom React hook that manages the loading and updating of a theme's core
 * CSS, ensuring the theme's core CSS is added to the document `<head>` as a
 * `<link>` element.
 */
const useThemeCore = ({
  themeCore,
  onComplete,
}) => {
  const [isThemeCoreComplete, setIsThemeCoreComplete] = useState(false);

  useEffect(() => {
    if (isThemeCoreComplete) {
      onComplete();
    }
  }, [isThemeCoreComplete, onComplete]);

  useEffect(() => {
    // If there is no theme core config, do nothing.
    if (!themeCore?.url) {
      setIsThemeCoreComplete(true);
      return;
    }

    const themeCoreLink = document.createElement('link');
    themeCoreLink.href = themeCore.url;
    themeCoreLink.rel = 'stylesheet';
    themeCoreLink.dataset.themeCore = 'true';
    themeCoreLink.onload = () => {
      setIsThemeCoreComplete(true);
    };
    themeCoreLink.onerror = () => {
      setIsThemeCoreComplete(true);
      const otherExistingLinks = document.head.querySelectorAll('link[data-theme-core="true"]');
      removeExistingLinks(otherExistingLinks);
      logError(`Failed to load core theme CSS from ${themeCore.url}. Aborting.`);
      return;
    };

    document.head.insertAdjacentElement(
      'beforeend',
      themeCoreLink,
    );
  }, [themeCore?.url, onComplete]);
};

export default useThemeCore;
