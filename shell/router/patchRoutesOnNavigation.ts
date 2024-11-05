import { RouteObject } from 'react-router';
import { mergeMessages } from '../../runtime';
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
  for (const federatedModule of federatedModules) {
    if (path.startsWith(federatedModule.path)) {
      missingModule = federatedModule;
      missingAppId = federatedModule.id;
      break;
    }
  }

  if (missingModule && missingAppId) {
    const moduleConfig = await loadModuleConfig(missingModule.federation.moduleId, missingModule.federation.libraryId);
    if (moduleConfig) {
      patchAppIdIntoRouteHandle(missingAppId, moduleConfig.route);
      patchAppModuleConfig(missingAppId, moduleConfig);
      mergeMessages(moduleConfig.messages);
      patch(SHELL_ID, [moduleConfig.route]);
    } else {
      // TODO: What do we do if it doesn't work?
      console.log('uhoh, no module config.');
    }
  }
}
