import { RouteObject } from 'react-router';

import { getConfig } from '../../runtime';
import { App } from '../../types';

export default function getAppRoutes() {
  const { apps } = getConfig();

  let routes: RouteObject[] = [];

  apps.forEach(
    (app: App) => {
      if (Array.isArray(app.routes)) {
        routes = routes.concat(app.routes);
      }
    }
  );
  return routes;
}
