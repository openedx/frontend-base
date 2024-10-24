import { RouteObject } from 'react-router';

// Save the appId in 'handle' so we can get it later.
export default function patchAppIdIntoRouteHandle(appId: string, route: RouteObject) {
  if (route.handle === undefined) {
    route.handle = {};
  }
  route.handle.appId = appId;
}
