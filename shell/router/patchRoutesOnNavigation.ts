import { RouteObject } from 'react-router';
import { patchAppModuleConfig } from '../../runtime/config';
import { FederatedAppConfig } from '../../types';
import { SHELL_ID } from '../data/constants';
import { getFederatedModules, loadModuleConfig } from '../data/moduleUtils';
import patchAppIdIntoRouteHandle from './patchAppIdIntoRouteHandle';

interface PatchRoutesOnNavigationArgs {
  path: string,
  patch: (routeId: string | null, children: RouteObject[]) => void,
}

export default async function patchRoutesOnNavigation({ path, patch }: PatchRoutesOnNavigationArgs) {
  const federatedModules = getFederatedModules();
  let missingModule: FederatedAppConfig | null = null;
  let missingAppId: string | null = null;
  const entries = Object.entries(federatedModules);
  for (const [appId, federatedModule] of entries) {
    if (path.startsWith(federatedModule.path)) {
      missingModule = federatedModule;
      missingAppId = appId;
      break;
    }
  }

  if (missingModule && missingAppId) {
    const moduleConfig = await loadModuleConfig(missingModule.moduleId, missingModule.libraryId);
    if (moduleConfig) {
      patchAppIdIntoRouteHandle(missingAppId, moduleConfig.route);
      patch(SHELL_ID, [moduleConfig.route]);
      patchAppModuleConfig(missingAppId, moduleConfig);
    } else {
      // TODO: What do we do if it doesn't work?
      console.log('uhoh, no module config.');
    }
  }
}
