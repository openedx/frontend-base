import { RouteObject } from 'react-router';
import { FederatedAppConfig } from '../../types';
import { SHELL_ID } from '../data/constants';
import { getFederatedModules, loadModuleConfig } from '../data/moduleUtils';

interface PatchRoutesOnNavigationArgs {
  path: string,
  patch: (routeId: string | null, children: RouteObject[]) => void,
}

export default async function patchRoutesOnNavigation({ path, patch }: PatchRoutesOnNavigationArgs) {
  const federatedModules = getFederatedModules();
  let missingModule: FederatedAppConfig | null = null;
  const entries = Object.values(federatedModules);
  for (let i = 0; i < entries.length; i++) {
    const federatedModule = federatedModules[i];
    if (path.startsWith(federatedModule.path)) {
      missingModule = federatedModule;
      break;
    }
  }

  if (missingModule) {
    const moduleConfig = await loadModuleConfig(missingModule.moduleId, missingModule.libraryId);
    if (moduleConfig) {
      patch(SHELL_ID, [moduleConfig.route]);
    } else {
      // TODO: What do we do if it doesn't work?
      console.log('uhoh, no module config.');
    }
  }
}
