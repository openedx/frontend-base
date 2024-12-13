import { loadRemote } from '@module-federation/runtime';
import { App, FederatedApp } from '../../types';
import { loadFederatedApp } from './loadFederatedApp';

jest.mock('@module-federation/runtime', () => ({
  loadRemote: jest.fn(),
}));

describe('loadFederatedApp', () => {
  const mockFederatedApp: FederatedApp = {
    moduleId: 'testModule',
    remoteId: 'testRemote',
  };

  it('should load the remote module successfully', async () => {
    const mockApp: { default: App } = { default: { routes: [] } };
    (loadRemote as jest.Mock).mockResolvedValue(mockApp);

    const result = await loadFederatedApp(mockFederatedApp);

    expect(loadRemote).toHaveBeenCalledWith('testRemote/testModule');
    expect(result).toEqual(mockApp.default);
  });

  it('should return null if the remote module is not found', async () => {
    (loadRemote as jest.Mock).mockResolvedValue(null);

    const result = await loadFederatedApp(mockFederatedApp);

    expect(loadRemote).toHaveBeenCalledWith('testRemote/testModule');
    expect(result).toBeNull();
  });

  it('should handle errors and return null', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (loadRemote as jest.Mock).mockRejectedValue(new Error('Test error'));

    const result = await loadFederatedApp(mockFederatedApp);

    expect(loadRemote).toHaveBeenCalledWith('testRemote/testModule');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading remote module testRemote/testModule', expect.any(Error));
    expect(result).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
