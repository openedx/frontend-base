import { loadRemote } from '@module-federation/runtime';
import { getConfig } from '../../runtime';
import {
  AppConfig, AppConfigTypes, ApplicationModuleConfig,
  InternalAppConfig
} from '../../types';

export function getFederatedModules() {
  const { apps } = getConfig();

  return apps.filter((app: AppConfig) => app.type === AppConfigTypes.FEDERATED);
}

export function getFederationRemotes() {
  const federatedModules = getFederatedModules();
  return federatedModules.map(app => ({
    name: app.appId,
    entry: app.remoteUrl
  }));
}

export async function loadModuleConfig(module, scope) {
  let config:ApplicationModuleConfig | null = null;
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

export function getInternalModules(): Array<InternalAppConfig> {
  const { apps } = getConfig();

  const internalModules = apps.filter((app: AppConfig) => app.type === AppConfigTypes.INTERNAL);

  return internalModules as Array<InternalAppConfig>;
}
