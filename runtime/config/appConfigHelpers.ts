import { AppConfigTypes, ApplicationModuleConfig, ExternalAppConfig, FederatedAppConfig, InternalAppConfig } from '../../types';

export function createInternalAppConfig(id: string, config: ApplicationModuleConfig, path?: string): InternalAppConfig {
  return {
    id,
    type: AppConfigTypes.INTERNAL,
    path,
    config,
  };
}

export function createExternalAppConfig(id: string, url: string): ExternalAppConfig {
  return {
    id,
    type: AppConfigTypes.EXTERNAL,
    url,
  };
}

export function createFederatedAppConfig(id: string, moduleId: string, libraryId: string, remoteUrl: string, path: string): FederatedAppConfig {
  return {
    id,
    type: AppConfigTypes.FEDERATED,
    path,
    federation: {
      libraryId,
      moduleId,
      remoteUrl,
    },
  };
}
