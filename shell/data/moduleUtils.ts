import { loadRemote } from '@module-federation/runtime';
import { getConfig } from '../../runtime';
import {
  AppConfig, AppConfigTypes, ApplicationModuleConfig,
  AppsConfig,
  FederatedAppConfig,
  InternalAppConfig
} from '../../types';

function filterAppsByType<T extends AppConfig>(apps: AppsConfig, type: AppConfigTypes) {
  const filteredApps: { [appId: string]: T } = {};
  Object.entries(apps).forEach(
    ([appId, app]: [appId: string, app: AppConfig]) => {
      if (app.type === type) {
        filteredApps[appId] = app as T;
      }
    }
  );
  return filteredApps;
}

export function getFederatedModules() {
  const { apps } = getConfig();
  return filterAppsByType<FederatedAppConfig>(apps, AppConfigTypes.FEDERATED);
}

export function getFederationRemotes() {
  const federatedModules = getFederatedModules();
  return Object.values(federatedModules).map((app: FederatedAppConfig) => ({
    name: app.libraryId,
    entry: app.remoteUrl
  }));
}

export async function loadModuleConfig(module, scope) {
  let config: ApplicationModuleConfig | null = null;
  try {
    const loadedRemote = await loadRemote<{ default: ApplicationModuleConfig }>(`${scope}/${module}`);
    if (loadedRemote !== null) {
      config = loadedRemote.default;
    }
  } catch (error) {
    console.error(`Error loading remote module ${scope}/${module}:`, error);
  }
  return config;
}

export function getInternalModules() {
  const { apps } = getConfig();
  return filterAppsByType<InternalAppConfig>(apps, AppConfigTypes.INTERNAL);
}
