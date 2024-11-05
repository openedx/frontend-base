import { getConfig } from '../../../runtime';
import { getAppUrl } from '../../../runtime/routing';
import {
  ConfigurableAppConfig,
  HeaderConfig,
  ResolvedHeaderConfig
} from '../../../types';
import isConfigurableApp from '../../data/isConfigurableApp';
import {
  anonymousLinks,
  authenticatedLinks,
  primaryLinks,
  secondaryLinks
} from '../defaults';

function overrideHeaderConfig(base: ResolvedHeaderConfig, override: HeaderConfig) {
  if (override.logoUrl !== undefined) {
    base.logoUrl = override.logoUrl;
  }
  if (override.logoDestinationUrl !== undefined) {
    base.logoDestinationUrl = override.logoDestinationUrl;
  }
  if (override.primaryLinks !== undefined) {
    base.primaryLinks = override.primaryLinks;
  }
  if (override.secondaryLinks !== undefined) {
    base.secondaryLinks = override.secondaryLinks;
  }
  if (override.anonymousLinks !== undefined) {
    base.anonymousLinks = override.anonymousLinks;
  }
  if (override.authenticatedLinks !== undefined) {
    base.authenticatedLinks = override.authenticatedLinks;
  }
}

export function resolveHeaderConfig(appId: string | null): ResolvedHeaderConfig {
  const siteConfig = getConfig();

  const config = {
    logoUrl: siteConfig.LOGO_URL,
    logoDestinationUrl: getAppUrl('learnerDashboard'),
    primaryLinks,
    secondaryLinks,
    anonymousLinks,
    authenticatedLinks,
  };

  if (siteConfig.header !== undefined) {
    const { header } = siteConfig;

    overrideHeaderConfig(config, header);
  }

  if (isConfigurableApp(appId)) {
    const { config: appModuleConfig } = siteConfig.apps[appId] as ConfigurableAppConfig;
    if (appModuleConfig.header !== undefined) {
      overrideHeaderConfig(config, appModuleConfig.header);
    }
  }

  return config;
}
