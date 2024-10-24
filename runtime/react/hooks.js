/* eslint-disable import/prefer-default-export */
import { useContext, useEffect } from 'react';
import { sendTrackEvent } from '../analytics';
import AppContext from './AppContext';

/**
 * A React hook that allows functional components to subscribe to application events.  This should
 * be used sparingly - for the most part, Context should be used higher-up in the application to
 * provide necessary data to a given component, rather than utilizing a non-React-like Pub/Sub
 * mechanism.
 *
 * @memberof module:React
 * @param {string} type
 * @param {function} callback
 */
export const useAppEvent = (type, callback) => {
  useEffect(() => {
    const subscriptionToken = global.PubSub.subscribe(type, callback);

    return function cleanup() {
      global.PubSub.unsubscribe(subscriptionToken);
    };
  }, [callback, type]);
};

/**
 * A React hook that tracks user's preferred color scheme (light or dark) and sends respective
 * event to the tracking service.
 *
 * @memberof module:React
 */
export const useTrackColorSchemeChoice = () => {
  useEffect(() => {
    const trackColorSchemeChoice = ({ matches }) => {
      const preferredColorScheme = matches ? 'dark' : 'light';
      sendTrackEvent('openedx.ui.frontend-base.prefers-color-scheme.selected', { preferredColorScheme });
    };
    const colorSchemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (colorSchemeQuery) {
      // send user's initial choice
      trackColorSchemeChoice(colorSchemeQuery);
      colorSchemeQuery.addEventListener('change', trackColorSchemeChoice);
    }
    return () => {
      if (colorSchemeQuery) {
        colorSchemeQuery.removeEventListener('change', trackColorSchemeChoice);
      }
    };
  }, []);
};

export function useAuthenticatedUser() {
  const { authenticatedUser } = useContext(AppContext);
  return authenticatedUser;
}

export function useConfig() {
  const { config } = useContext(AppContext);
  return config;
}
