import { RouteObject } from 'react-router';

import { InternalAppConfig } from '../../types';
import { getInternalModules } from '../data/moduleUtils';

export default function createInternalRoutes() {
  const internalModules = getInternalModules();

  let routes: Array<RouteObject> = [];

  internalModules.forEach((internalModule: InternalAppConfig) => {
    const moduleRoutes = internalModule.config.routes;
    routes = [...routes, ...moduleRoutes];
  });
  return routes;
}
