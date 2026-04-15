import { redirect, RouteObject } from 'react-router';

import { getSiteConfig, getUrlByRouteRole } from '../../runtime';
import { App } from '../../types';
import { homeRole } from '../constants';

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

  /*
   * If any app claims the home role, append a redirect from / to that URL.
   * Appended last so that an app with its own / route takes priority.
   */
  const homeUrl = getUrlByRouteRole(homeRole);
  if (homeUrl) {
    routes.push({
      path: '/',
      loader: () => redirect(homeUrl),
    });
  }

  return routes;
}
