import React from 'react';

import { getSiteConfig } from '../../runtime';
import { App, RoleRouteObject } from '../../types';
import AuthGuard from './AuthGuard';

function createAuthenticatedComponent(OriginalComponent: React.ComponentType<any>) {
  const AuthenticatedComponent: React.FC = (props) => {
    return React.createElement(
      AuthGuard,
      {
        requireAuthenticatedUser: true,
      } as React.ComponentProps<typeof AuthGuard>,
      React.createElement(OriginalComponent, props)
    );
  };

  return AuthenticatedComponent;
}

function wrapRouteWithAuth(route: RoleRouteObject): RoleRouteObject {
  // Check if route has requireAuthenticatedUser property using type assertion
  const routeWithAuth = route as RoleRouteObject & { requireAuthenticatedUser?: boolean };
  if (routeWithAuth.requireAuthenticatedUser && route.Component) {
    return {
      ...route,
      Component: createAuthenticatedComponent(route.Component as React.ComponentType<any>),
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
