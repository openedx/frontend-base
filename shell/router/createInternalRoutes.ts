import { RouteObject } from 'react-router';

import { InternalAppConfig } from '../../types';
import { getInternalModules } from '../data/moduleUtils';

export default function createInternalRoutes() {
  const internalModules = getInternalModules();

  const routes: Array<RouteObject> = [];

  Object.values(internalModules).forEach((internalModule: InternalAppConfig) => {
    const route = { ...internalModule.config.route };
    if (internalModule.path) {
      route.path = internalModule.path;
    }
    routes.push(route);
  });
  return routes;
}
