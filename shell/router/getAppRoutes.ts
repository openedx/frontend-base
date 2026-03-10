import React from 'react';

import { getSiteConfig, AuthenticatedPageRoute } from '../../runtime';
import { App, RoleRouteObject } from '../../types';

interface AuthComponentProps {
  redirectUrl?: string | null,
  requireAuthenticatedUser?: boolean,
  children?: React.ReactNode,
}

function wrapRouteWithAuth(route: RoleRouteObject): RoleRouteObject {
  const routeWithAuth = route as RoleRouteObject & {
    requireAuthenticatedUser?: boolean,
    redirectUrl?: string,
  };
  if (routeWithAuth.requireAuthenticatedUser && route.Component) {
    const OriginalComponent = route.Component;
    return {
      ...route,
      Component: (props) =>
        React.createElement(
          AuthenticatedPageRoute as React.ComponentType<AuthComponentProps>,
          {
            redirectUrl: routeWithAuth.redirectUrl ?? null,
          },
          React.createElement(OriginalComponent, props)
        ),
    };
  }

  return route;
}

export default function getAppRoutes() {
  const { apps } = getSiteConfig();

  let routes: RoleRouteObject[] = [];

  if (apps) {
    apps.forEach(
      (app: App) => {
        if (Array.isArray(app.routes)) {
          const wrappedRoutes = app.routes.map((route: RoleRouteObject) =>
            wrapRouteWithAuth(route)
          );
          routes = routes.concat(wrappedRoutes);
        }
      }
    );
  }
  return routes;
}
