import { RouteObject } from 'react-router';
import { patchMessages } from '../../runtime';
import { patchApp } from '../../runtime/config';
import { SHELL_ID } from '../data/constants';
import { getFederatedApps, loadApp } from '../data/moduleUtils';

interface PatchRoutesOnNavigationArgs {
  path: string,
  patch: (routeId: string | null, children: RouteObject[]) => void,
}

export default async function patchRoutesOnNavigation({ path, patch }: PatchRoutesOnNavigationArgs) {
  const federatedApps = getFederatedApps();
  for (const federatedApp of federatedApps) {
    if (federatedApp.hints?.paths) {
      for (const hintPath of federatedApp.hints.paths) {
        if (path.startsWith(hintPath)) {
          const app = await loadApp(federatedApp.moduleId, federatedApp.remoteId);
          if (app) {
            const { routes, messages } = app;

            patchApp(app);
            patchMessages(messages);
            if (Array.isArray(routes)) {
              patch(SHELL_ID, routes);
            }
          } else {
            throw new Error(`Failed to load app ${federatedApp.moduleId} from ${federatedApp.remoteId} remote.`);
          }
        }
      }
    }
  }
}
