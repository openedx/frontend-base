import { loadRemote } from '@module-federation/runtime';
import { getConfig, mergeMessages } from '../../runtime';
import {
  AppConfig, AppConfigTypes, ApplicationModuleConfig,
  FederatedAppConfig,
  InternalAppConfig
} from '../../types';

function filterAppsByType<T extends AppConfig>(apps: AppConfig[], type: AppConfigTypes): T[] {
  return apps.filter((app): app is T => app.type === type);
}

export function getFederatedModules() {
  const { apps } = getConfig();
  return filterAppsByType<FederatedAppConfig>(apps, AppConfigTypes.FEDERATED);
}

export function getFederationRemotes() {
  return getFederatedModules().map((app: FederatedAppConfig) => ({
    name: app.federation.libraryId,
    entry: app.federation.remoteUrl
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

export function mergeInternalMessages() {
  getInternalModules().forEach((module) => {
    mergeMessages(module.config.messages);
  });
}
