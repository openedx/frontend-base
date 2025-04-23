import { RouteObject } from 'react-router';

import { RoleRouteObject } from '../../types';
import { getConfig } from '../config';

export function getUrlByRouteRole(role: string) {
  const { apps, federatedApps, externalRoutes } = getConfig();

  for (const app of apps) {
    if (Array.isArray(app.routes)) {
      for (const route of app.routes) {
        if (route?.handle?.role === role) {
          return route.path ?? null;
        }
      }
    }
  }

  for (const federatedApp of federatedApps) {
    if (federatedApp.rolePaths) {
      if (federatedApp.rolePaths[role] !== undefined) {
        return federatedApp.rolePaths[role];
      }
    }
  }

  for (const externalRoute of externalRoutes) {
    if (externalRoute.role === role) {
      return externalRoute.url;
    }
  }

  return null;
}

export function isRoleRouteObject(match: RouteObject): match is RoleRouteObject {
  return match.handle !== undefined && 'role' in match.handle;
}
