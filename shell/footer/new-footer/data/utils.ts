import { getConfig } from '../../../../runtime';
import { getAppUrl } from '../../../../runtime/routing';
import {
  ConfigurableAppConfig, FooterConfig, ResolvedFooterConfig
} from '../../../../types';
import isConfigurableApp from '../../../data/isConfigurableApp';
import { centerLinks, copyrightNotice, leftLinks, revealMenu, rightLinks } from '../defaults';

function overrideFooterConfig(base: ResolvedFooterConfig, override: FooterConfig) {
  if (override.logoUrl !== undefined) {
    base.logoUrl = override.logoUrl;
  }
  if (override.logoDestinationUrl !== undefined) {
    base.logoDestinationUrl = override.logoDestinationUrl;
  }
  if (override.leftLinks !== undefined) {
    base.leftLinks = override.leftLinks;
  }
  if (override.centerLinks !== undefined) {
    base.centerLinks = override.centerLinks;
  }
  if (override.rightLinks !== undefined) {
    base.rightLinks = override.rightLinks;
  }
  if (override.revealMenu !== undefined) {
    base.revealMenu = override.revealMenu;
  }
  if (override.copyrightNotice !== undefined) {
    base.copyrightNotice = override.copyrightNotice;
  }
}

export function resolveFooterConfig(appId: string | null): ResolvedFooterConfig {
  const siteConfig = getConfig();

  const config: ResolvedFooterConfig = {
    logoUrl: siteConfig.LOGO_URL,
    logoDestinationUrl: getAppUrl('learner-dashboard'),
    leftLinks,
    centerLinks,
    rightLinks,
    revealMenu,
    copyrightNotice,
  };

  if (siteConfig.footer !== undefined) {
    const { footer } = siteConfig;

    overrideFooterConfig(config, footer);
  }

  if (isConfigurableApp(appId)) {
    const { config: appModuleConfig } = siteConfig.apps[appId] as ConfigurableAppConfig;
    if (appModuleConfig.footer !== undefined) {
      overrideFooterConfig(config, appModuleConfig.footer);
    }
  }

  return config;
}
