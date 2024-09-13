import { FederatedAppConfig } from '../../types';
import { SHELL_ID } from '../data/constants';
import { getFederatedModules, loadModuleConfig } from '../data/moduleUtils';

export default async function patchRoutesOnNavigation({ path, patch }) {
  const federatedModules = getFederatedModules();
  let missingModule: FederatedAppConfig | null = null;
  for (let i = 0; i < federatedModules.length; i++) {
    const federatedModule = federatedModules[i];
    if (path.startsWith(federatedModule.path)) {
      missingModule = federatedModule;
      break;
    }
  }

  if (missingModule) {
    const moduleConfig = await loadModuleConfig(missingModule.moduleId, missingModule.appId);
    if (moduleConfig) {
      patch(SHELL_ID, moduleConfig.routes);
    } else {
      console.log('uhoh, no module config.');
    }
  }
}
