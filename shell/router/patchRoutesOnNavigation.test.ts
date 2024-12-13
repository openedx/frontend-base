import { mergeMessages } from '../../runtime';
import { patchApp } from '../../runtime/config';
import { SHELL_ID } from '../federation/constants';
import { getFederatedApps } from '../federation/getFederatedApps';
import { initializeRemotes } from '../federation/initializeRemotes';
import { loadFederatedApp } from '../federation/loadFederatedApp';
import patchRoutesOnNavigation from './patchRoutesOnNavigation';

jest.mock('../federation/getFederatedApps');
jest.mock('../federation/loadFederatedApp');
jest.mock('../../runtime/config');
jest.mock('../federation/initializeRemotes');
jest.mock('../../runtime', () => ({
  mergeMessages: jest.fn()
}));

describe('patchRoutesOnNavigation', () => {
  const mockPatch = jest.fn();
  const mockFederatedApp = {
    moduleId: 'testModule',
    remoteId: 'testRemote',
    hints: { paths: ['/test'] },
  };
  const mockFederatedAppNoHints = {
    moduleId: 'testModule',
    remoteId: 'testRemote',
  };
  const mockFederatedAppEmptyPaths = {
    moduleId: 'testModule',
    remoteId: 'testRemote',
    hints: { paths: [] },
  };
  const mockApp = {
    routes: [{ path: '/test', element: 'TestComponent' }],
    messages: { test: 'message' },
    remotes: [],
  };
  const mockAppNoRoutes = {
    messages: { test: 'message' },
    remotes: [],
  };
  const mockAppNoRemotes = {
    routes: [{ path: '/test', element: 'TestComponent' }],
    messages: { test: 'message' },
  };

  function expectNoFederatedAppLoaded() {
    expect(loadFederatedApp).not.toHaveBeenCalled();
    expect(patchApp).not.toHaveBeenCalled();
    expect(initializeRemotes).not.toHaveBeenCalled();
    expect(mergeMessages).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should patch the app contents when path matches hint path', async () => {
    (getFederatedApps as jest.Mock).mockReturnValue([mockFederatedApp]);
    (loadFederatedApp as jest.Mock).mockResolvedValue(mockApp);

    await patchRoutesOnNavigation({ path: '/test/path', patch: mockPatch });

    expect(getFederatedApps).toHaveBeenCalled();
    expect(loadFederatedApp).toHaveBeenCalledWith(mockFederatedApp);
    expect(patchApp).toHaveBeenCalledWith(mockApp);
    expect(initializeRemotes).toHaveBeenCalled();
    expect(mergeMessages).toHaveBeenCalledWith(mockApp.messages);
    expect(mockPatch).toHaveBeenCalledWith(SHELL_ID, mockApp.routes);
  });

  it('should not patch the app contents when path does not match hint path', async () => {
    (getFederatedApps as jest.Mock).mockReturnValue([mockFederatedApp]);
    (loadFederatedApp as jest.Mock).mockResolvedValue(mockApp);

    await patchRoutesOnNavigation({ path: '/no-match', patch: mockPatch });

    expect(getFederatedApps).toHaveBeenCalled();
    expectNoFederatedAppLoaded();
  });

  it('should not patch the app contents when empty hints paths array', async () => {
    (getFederatedApps as jest.Mock).mockReturnValue([mockFederatedAppEmptyPaths]);
    (loadFederatedApp as jest.Mock).mockResolvedValue(mockApp);

    await patchRoutesOnNavigation({ path: '/no-match', patch: mockPatch });

    expect(getFederatedApps).toHaveBeenCalled();
    expectNoFederatedAppLoaded();
  });

  it('should not patch the app contents when empty hints paths array', async () => {
    (getFederatedApps as jest.Mock).mockReturnValue([mockFederatedAppNoHints]);
    (loadFederatedApp as jest.Mock).mockResolvedValue(mockApp);

    await patchRoutesOnNavigation({ path: '/no-match', patch: mockPatch });

    expect(getFederatedApps).toHaveBeenCalled();
    expectNoFederatedAppLoaded();
  });

  it('should not call patch when app routes is undefined', async () => {
    (getFederatedApps as jest.Mock).mockReturnValue([mockFederatedApp]);
    (loadFederatedApp as jest.Mock).mockResolvedValue(mockAppNoRoutes);

    await patchRoutesOnNavigation({ path: '/test/path', patch: mockPatch });

    expect(getFederatedApps).toHaveBeenCalled();
    expect(loadFederatedApp).toHaveBeenCalled();
    expect(patchApp).toHaveBeenCalled();
    expect(initializeRemotes).toHaveBeenCalled();
    expect(mergeMessages).toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it('should not call initializeRemotes if app remotes is undefined', async () => {
    (getFederatedApps as jest.Mock).mockReturnValue([mockFederatedApp]);
    (loadFederatedApp as jest.Mock).mockResolvedValue(mockAppNoRemotes);

    await patchRoutesOnNavigation({ path: '/test/path', patch: mockPatch });

    expect(getFederatedApps).toHaveBeenCalled();
    expect(loadFederatedApp).toHaveBeenCalled();
    expect(patchApp).toHaveBeenCalled();
    expect(initializeRemotes).not.toHaveBeenCalled();
    expect(mergeMessages).toHaveBeenCalled();
    expect(mockPatch).toHaveBeenCalled();
  });

  it('should throw an error if loading federated app fails', async () => {
    (getFederatedApps as jest.Mock).mockReturnValue([mockFederatedApp]);
    (loadFederatedApp as jest.Mock).mockResolvedValue(mockApp);

    (loadFederatedApp as jest.Mock).mockResolvedValue(null);

    await expect(patchRoutesOnNavigation({ path: '/test/path', patch: mockPatch }))
      .rejects
      .toThrow('Failed to load app testModule from testRemote remote.');

    expect(loadFederatedApp).toHaveBeenCalled();
    expect(patchApp).not.toHaveBeenCalled();
    expect(initializeRemotes).not.toHaveBeenCalled();
    expect(mergeMessages).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  });
});
