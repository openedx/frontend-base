import { getConfig } from '../../runtime';
import { AppConfigTypes } from '../../types';

export default function isConfigurableApp(appId): appId is string {
  const siteConfig = getConfig();

  if (siteConfig.apps[appId] !== undefined) {
    const { type } = siteConfig.apps[appId];

    if (type === AppConfigTypes.INTERNAL || type === AppConfigTypes.FEDERATED) {
      return true;
    }
  }

  return false;
}
