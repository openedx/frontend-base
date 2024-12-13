import { getConfig } from '../../runtime';

export function getFederatedApps() {
  const { federatedApps } = getConfig();
  return federatedApps;
}
