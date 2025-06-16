import { RouteObject } from 'react-router';

import { getSiteConfig } from '../../runtime';
import { App } from '../../types';

export default function getAppRoutes() {
  const { apps } = getSiteConfig();

  let routes: RouteObject[] = [];

  if (apps) {
    apps.forEach(
      (app: App) => {
        if (Array.isArray(app.routes)) {
          routes = routes.concat(app.routes);
        }
      }
    );
  }
  return routes;
}
