import { RouteObject } from 'react-router';

import { RoleRouteObject } from '../../types';
import { getSiteConfig } from '../config';

function findRoleInRoutes(routes: RouteObject[], role: string, prefix: string = ''): string | null {
  for (const route of routes) {
    const segment = route.path ?? '';
    const fullPath = segment.startsWith('/') ? segment : `${prefix}/${segment}`.replace(/\/+/g, '/');

    if (route.handle?.role === role) {
      return fullPath || null;
    }

    if (Array.isArray(route.children)) {
      const found = findRoleInRoutes(route.children, role, fullPath);
      if (found !== null) {
        return found;
      }
    }
  }
  return null;
}

export function getUrlByRouteRole(role: string) {
  const { apps, externalRoutes } = getSiteConfig();

  if (apps) {
    for (const app of apps) {
      if (Array.isArray(app.routes)) {
        const found = findRoleInRoutes(app.routes, role);
        if (found !== null) {
          return found;
        }
      }
    }
  }

  if (externalRoutes) {
    for (const externalRoute of externalRoutes) {
      if (externalRoute.role === role) {
        return externalRoute.url;
      }
    }
  }

  return null;
}

export function isRoleRouteObject(match: RouteObject): match is RoleRouteObject {
  return match.handle !== undefined && 'role' in match.handle;
}
