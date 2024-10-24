import { isValidElement, ReactElement, ReactNode } from 'react';
import { IntlShape, MessageDescriptor } from 'react-intl';
import { getConfig } from '../../../runtime';
import { getAppUrl } from '../../../runtime/routing';
import {
  AppConfigTypes,
  AppMenuItem,
  ConfigurableAppConfig,
  DropdownMenuItem, HeaderConfig, LinkMenuItem, MenuItem,
  ResolvedHeaderConfig,
  UrlMenuItem
} from '../../../types';
import {
  anonymousLinks, authenticatedLinks, primaryLinks, secondaryLinks
} from '../defaults';

// A name can be a string or a react-intl MessageDescriptor.
export function getItemLabel(item: LinkMenuItem | DropdownMenuItem, intl: IntlShape): ReactNode {
  const { label } = item;

  if (typeof label === 'string') {
    return label;
  }

  if (isValidElement(label)) {
    return label;
  }

  // If it's not a valid element, it's a MessageDescriptor.
  return intl.formatMessage(label as MessageDescriptor);
}

export function isAppMenuItem(item: MenuItem): item is AppMenuItem {
  return item && typeof item === 'object' && 'appId' in item;
}

export function isUrlMenuItem(item: MenuItem): item is UrlMenuItem {
  return item && typeof item === 'object' && 'url' in item;
}

export function isReactNodeMenuItem(item: LinkMenuItem | DropdownMenuItem | ReactElement): item is ReactElement {
  return isValidElement(item);
}

export function isDropdownMenuItem(item: MenuItem): item is DropdownMenuItem {
  return item && typeof item === 'object' && 'items' in item;
}

function overrideHeaderConfig(base: HeaderConfig, override: HeaderConfig) {
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
    logoDestinationUrl: getAppUrl('learner-dashboard'),
    primaryLinks,
    secondaryLinks,
    anonymousLinks,
    authenticatedLinks,
  };

  if (siteConfig.header !== undefined) {
    const { header } = siteConfig;

    overrideHeaderConfig(config, header);
  }

  if (appId !== null) {
    if (siteConfig.apps[appId] !== undefined) {
      const { type } = siteConfig.apps[appId];

      if (type === AppConfigTypes.INTERNAL || type === AppConfigTypes.FEDERATED) {
        const { config: appModuleConfig } = siteConfig.apps[appId] as ConfigurableAppConfig;
        if (appModuleConfig.header !== undefined) {
          overrideHeaderConfig(config, appModuleConfig.header);
        }
      }
    }
  }

  return config;
}
