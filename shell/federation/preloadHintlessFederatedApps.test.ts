import { patchApp } from '../../runtime/config';
import { App, FederatedApp } from '../../types';
import { getFederatedApps } from './getFederatedApps';
import { loadFederatedApp } from './loadFederatedApp';
import { federatedAppHasHints, getFederatedAppsWithoutHints, preloadHintlessFederatedApps } from './preloadHintlessFederatedApps';

jest.mock('./getFederatedApps');
jest.mock('./loadFederatedApp');
jest.mock('../../runtime/config');

describe('preloadHintlessFederatedApps', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should preload and patch hintless federated apps', async () => {
    const mockFederatedApps: FederatedApp[] = [
      { moduleId: 'app1', remoteId: 'remote1', hints: {} },
      { moduleId: 'app2', remoteId: 'remote2', hints: { paths: ['path1'] } },
    ];

    const app1: App = {
      routes: [
        {
          id: 'app1',
          path: '/app1',
        }
      ]
    };

    (getFederatedApps as jest.Mock).mockReturnValue(mockFederatedApps);
    (loadFederatedApp as jest.Mock).mockResolvedValue(app1);

    await preloadHintlessFederatedApps();

    expect(loadFederatedApp).toHaveBeenCalledTimes(1);
    expect(loadFederatedApp).toHaveBeenCalledWith(mockFederatedApps[0]);
    expect(patchApp).toHaveBeenCalledTimes(1);
    expect(patchApp).toHaveBeenCalledWith(app1);
  });

  it('should throw an error if app fails to load', async () => {
    const mockFederatedApps: FederatedApp[] = [
      { moduleId: 'app1', remoteId: 'remote1', hints: {} },
    ];
    (getFederatedApps as jest.Mock).mockReturnValue(mockFederatedApps);
    (loadFederatedApp as jest.Mock).mockResolvedValue(null);

    await expect(preloadHintlessFederatedApps()).rejects.toThrow('Failed to load app app1 from remote1 remote.');
  });

  it('should do nothing if there are no federated apps', async () => {
    const mockFederatedApps: FederatedApp[] = [];
    (getFederatedApps as jest.Mock).mockReturnValue(mockFederatedApps);

    await preloadHintlessFederatedApps();

    expect(loadFederatedApp).not.toHaveBeenCalled();
    expect(patchApp).not.toHaveBeenCalled();
  });
});

describe('getFederatedAppsWithoutHints', () => {
  it('should return federated apps without hints', () => {
    const mockFederatedApps: FederatedApp[] = [
      { moduleId: 'app1', remoteId: 'remote1', hints: {} },
      { moduleId: 'app2', remoteId: 'remote2', hints: { paths: ['path1'] } },
    ];
    (getFederatedApps as jest.Mock).mockReturnValue(mockFederatedApps);

    const result = getFederatedAppsWithoutHints();

    expect(result).toEqual([{ moduleId: 'app1', remoteId: 'remote1', hints: {} }]);
  });
});

describe('federatedAppHasHints', () => {
  it('should return true if federated app has hints', () => {
    const federatedApp: FederatedApp = { moduleId: 'app1', remoteId: 'remote1', hints: { paths: ['path1'] } };

    const result = federatedAppHasHints(federatedApp);

    expect(result).toBe(true);
  });

  it('should return false if federated app does not have hints', () => {
    let federatedApp: FederatedApp = { moduleId: 'app1', remoteId: 'remote1' };
    let result = federatedAppHasHints(federatedApp);
    expect(result).toBe(false);

    federatedApp = { moduleId: 'app1', remoteId: 'remote1', hints: {} };
    result = federatedAppHasHints(federatedApp);
    expect(result).toBe(false);

    federatedApp = { moduleId: 'app1', remoteId: 'remote1', hints: { paths: [] } };
    result = federatedAppHasHints(federatedApp);
    expect(result).toBe(false);
  });
});
