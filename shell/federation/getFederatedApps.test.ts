import { mergeConfig } from '../../runtime';
import { getFederatedApps } from './getFederatedApps';

describe('getFederatedApps', () => {
  it ('should return an empty array of federated apps', () => {
    const federatedApps = getFederatedApps();
    expect(federatedApps).toEqual([]);
  });

  it ('should return an array of federated apps from SiteConfig', () => {
    const remote = {
      remoteId: 'foo',
      moduleId: 'fooConfig',
    };

    mergeConfig({
      federatedApps: [remote]
    });

    const federatedApps = getFederatedApps();

    expect(federatedApps).toHaveLength(1);
    expect(federatedApps[0]).toEqual(remote);
  });
});
