import { loadRemote } from '@module-federation/runtime';
import { getConfig, patchMessages } from '../../runtime';
import {
  App
} from '../../types';

export function getFederatedApps() {
  const { federatedApps } = getConfig();
  return federatedApps;
}

export function getFederationRemotes() {
  const { remotes } = getConfig();
  if (Array.isArray(remotes)) {
    return remotes.map((remote) => ({
      name: remote.id,
      entry: remote.url
    }));
  }
  return [];
}

export async function loadApp(module, scope) {
  let config: App | null = null;
  try {
    const loadedRemote = await loadRemote<{ default: App }>(`${scope}/${module}`);
    if (loadedRemote !== null) {
      config = loadedRemote.default;
    }
  } catch (error) {
    console.error(`Error loading remote module ${scope}/${module}:`, error);
  }
  return config;
}

export function addAppMessages() {
  const { apps } = getConfig();
  apps.forEach((app) => {
    patchMessages(app.messages);
  });
}
