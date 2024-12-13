import { loadRemote } from '@module-federation/runtime';
import { getConfig, patchMessages } from '../../runtime';
import { patchApp } from '../../runtime/config';
import { isValidVariableName } from '../../runtime/utils';
import {
  App,
  FederatedApp
} from '../../types';

export function getFederatedApps() {
  const { federatedApps } = getConfig();
  return federatedApps;
}

export function getFederationRemotes() {
  const { remotes } = getConfig();
  if (Array.isArray(remotes)) {
    // Validate the remote IDs are valid names.
    remotes.forEach(remote => {
      if (!isValidVariableName(remote.id)) {
        throw new Error(`Module federation error.\n\nThe remote ID "${remote.id}" is invalid. This remote's URL is "${remote.url}".\n\nThe identifier must be a valid JavaScript variable name.  It must start with a letter, cannot be a reserved word, and can only contain letters, digits, underscores and dollar signs.`);
      }
    });

    return remotes.map((remote) => ({
      name: remote.id,
      // We add a date here to ensure that we cache bust the remote entry file regardless of what
      // headers it returns to us.  This ensures that even if operators haven't set up their
      // caching headers correctly, we always get the most recent version.
      entry: `${remote.url}?${new Date().getTime()}`,
    }));
  }
  return [];
}

export function getFederatedAppsWithoutHints() {
  const federatedApps = getFederatedApps();

  return federatedApps.filter((federatedApp) => {
    return !federatedAppHasHints(federatedApp);
  });
}

function federatedAppHasHints(federatedApp: FederatedApp) {
  if (typeof federatedApp.hints === 'object') {
    const { paths, slots } = federatedApp.hints;
    if (Array.isArray(paths) && paths.length > 0) {
      return true;
    }
    if (Array.isArray(slots) && slots.length > 0) {
      return true;
    }
  }
  return false;
}

export async function loadApp(module, scope) {
  let app: App | null = null;
  try {
    const loadedRemote = await loadRemote<{ default: App }>(`${scope}/${module}`);
    if (loadedRemote !== null) {
      app = loadedRemote.default;
    }
  } catch (error) {
    console.error(`Error loading remote module ${scope}/${module}:`, error);
  }
  return app;
}

export async function preloadFederatedApps(federatedApps: FederatedApp[]) {
  for (const federatedApp of federatedApps) {
    const app = await loadApp(federatedApp.moduleId, federatedApp.remoteId);
    if (app) {
      patchApp(app);
    } else {
      throw new Error(`Failed to load app ${federatedApp.moduleId} from ${federatedApp.remoteId} remote.`);
    }
  }
}

export function addAppMessages() {
  const { apps } = getConfig();
  apps.forEach((app) => {
    patchMessages(app.messages);
  });
}
