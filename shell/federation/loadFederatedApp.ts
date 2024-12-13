import { loadRemote } from '@module-federation/runtime';
import {
  App,
  FederatedApp
} from '../../types';

export async function loadFederatedApp(federatedApp: FederatedApp) {
  let app: App | null = null;
  const { moduleId, remoteId } = federatedApp;
  const scopeAndModule = `${remoteId}/${moduleId}`;
  try {
    const loadedRemote = await loadRemote<{ default: App }>(scopeAndModule);
    if (loadedRemote !== null) {
      app = loadedRemote.default;
    }
  } catch (error) {
    console.error(`Error loading remote module ${scopeAndModule}`, error);
  }
  return app;
}
