import { RouteObject } from 'react-router';
import { mergeMessages } from '../../runtime';
import { patchApp } from '../../runtime/config';
import { SHELL_ID } from '../federation/constants';
import { getFederatedApps } from '../federation/getFederatedApps';
import { initializeRemotes } from '../federation/initializeRemotes';
import { loadFederatedApp } from '../federation/loadFederatedApp';

interface PatchRoutesOnNavigationArgs {
  path: string,
  patch: (routeId: string | null, children: RouteObject[]) => void,
}

export default async function patchRoutesOnNavigation({ path, patch: patchRoutes }: PatchRoutesOnNavigationArgs) {
  const federatedApps = getFederatedApps();
  for (const federatedApp of federatedApps) {
    if (federatedApp.hints?.paths) {
      for (const hintPath of federatedApp.hints.paths) {
        if (path.startsWith(hintPath)) {
          const app = await loadFederatedApp(federatedApp);
          if (app) {
            const { routes, messages, remotes } = app;

            patchApp(app);
            if (remotes !== undefined) {
              initializeRemotes();
            }
            mergeMessages(messages);
            if (Array.isArray(routes)) {
              patchRoutes(SHELL_ID, routes);
            }
          } else {
            throw new Error(`Failed to load app ${federatedApp.moduleId} from ${federatedApp.remoteId} remote.`);
          }
        }
      }
    }
  }
}
