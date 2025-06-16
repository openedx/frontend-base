import { useCallback, useContext, useEffect, useState } from 'react';

import { useMatches } from 'react-router';
import { sendTrackEvent } from '../analytics';
import { getActiveRoles, setActiveRouteRoles } from '../config';
import { ACTIVE_ROLES_CHANGED } from '../constants';
import { isRoleRouteObject } from '../routing';
import { subscribe, unsubscribe } from '../subscriptions';
import SiteContext from './SiteContext';
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
    subscribe(type, callback);

    return () => {
      unsubscribe(type, callback);
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
  const { authenticatedUser } = useContext(SiteContext);
  return authenticatedUser;
}

export function useConfig() {
  const { config } = useContext(SiteContext);
  return config;
}

export function useAppConfig() {
  const { config } = useContext(AppContext);
  return config;
}

export function useActiveRouteRoleWatcher() {
  const matches = useMatches();

  // We create this callback so we can use it right away to populate the default state value.
  const findActiveRouteRoles = useCallback(() => {
    // Starts with the widget roles and adds the others in.
    const roles: string[] = [];

    // Route roles
    for (const match of matches) {
      if (isRoleRouteObject(match)) {
        if (!roles.includes(match.handle.role)) {
          roles.push(match.handle.role);
        }
      }
    }

    return roles;
  }, [matches]);

  useEffect(() => {
    setActiveRouteRoles(findActiveRouteRoles());
  }, [matches, findActiveRouteRoles]);
}

export function useActiveRoles() {
  const [roles, setRoles] = useState<string[]>(getActiveRoles());
  useAppEvent(ACTIVE_ROLES_CHANGED, () => {
    setRoles(getActiveRoles());
  });

  return roles;
}
