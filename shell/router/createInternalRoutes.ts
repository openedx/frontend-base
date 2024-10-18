import { RouteObject } from 'react-router';

import { InternalAppConfig } from '../../types';
import { getInternalModules } from '../data/moduleUtils';

export default function createInternalRoutes() {
  const internalModules = getInternalModules();

  const routes: Array<RouteObject> = [];

  Object.entries(internalModules).forEach(
    ([appId, internalModule]: [appId: string, internalModule: InternalAppConfig]) => {
      const route = { ...internalModule.config.route };
      // Route path override
      if (internalModule.path) {
        route.path = internalModule.path;
      }
      // Save the appId in 'handle' so we can get it later.
      if (route.handle === undefined) {
        route.handle = {};
      }
      route.handle.appId = appId;
      routes.push(route);
    }
  );
  return routes;
}
