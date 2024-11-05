import { RouteObject } from 'react-router';

import { InternalAppConfig } from '../../types';
import { getInternalModules } from '../data/moduleUtils';
import patchAppIdIntoRouteHandle from './patchAppIdIntoRouteHandle';

export default function createInternalRoutes() {
  const internalModules = getInternalModules();

  const routes: RouteObject[] = [];

  internalModules.forEach(
    (internalModule: InternalAppConfig) => {
      const route = { ...internalModule.config.route };
      // Route path override
      if (internalModule.path) {
        route.path = internalModule.path;
      }
      patchAppIdIntoRouteHandle(internalModule.id, route);
      routes.push(route);
    }
  );
  return routes;
}
