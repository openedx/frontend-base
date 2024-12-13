import { init } from '@module-federation/runtime';
import { SHELL_ID } from './constants';
import { getFederationRemotes } from './getFederationRemotes';
import { initializeRemotes } from './initializeRemotes';
import { mergeAppRemotes } from './mergeAppRemotes';

jest.mock('@module-federation/runtime', () => ({
  init: jest.fn(),
}));

jest.mock('./getFederationRemotes', () => ({
  getFederationRemotes: jest.fn(),
}));

jest.mock('./mergeAppRemotes', () => ({
  mergeAppRemotes: jest.fn(),
}));

describe('initializeRemotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call init with correct arguments', () => {
    const remotes = [
      {
        name: 'remote1',
        entry: 'http://localhost:8001/remoteEntry.js',
      },
      {
        name: 'remote2',
        entry: 'http://localhost:8002/remoteEntry.js',
      }
    ];

    (getFederationRemotes as jest.Mock).mockReturnValue(remotes);

    initializeRemotes();

    expect(mergeAppRemotes).toHaveBeenCalled();
    expect(getFederationRemotes).toHaveBeenCalled();
    expect(init).toHaveBeenCalledWith({
      name: SHELL_ID,
      remotes,
    });
  });
});
