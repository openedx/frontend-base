import { mergeConfig } from '../../runtime';
import * as config from '../../runtime/config';
import { mergeAppRemotes } from './mergeAppRemotes';

describe('mergeAppRemotes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should not merge remotes if there are none', () => {
    mergeConfig({
      apps: [
        {
          routes: []
          // This app has no remotes!
        }
      ]
    });
    jest.spyOn(config, 'mergeRemotes');

    mergeAppRemotes();

    expect(config.mergeRemotes).not.toHaveBeenCalled();
  });

  it('should merge remotes once if an app has some', () => {
    mergeConfig({
      apps: [
        {
          remotes: [
            {
              id: 'remote1',
              url: 'http://localhost:8001/remoteEntry.js',
            }
          ]
        }
      ]
    });

    mergeAppRemotes();

    expect(config.mergeRemotes).toHaveBeenCalledTimes(1);
    expect(config.mergeRemotes).toHaveBeenCalledWith([
      {
        id: 'remote1',
        url: 'http://localhost:8001/remoteEntry.js',
      }
    ]);
  });

  it('should merge remotes once for each app that has some', () => {
    mergeConfig({
      apps: [
        {
          remotes: [
            {
              id: 'remote1',
              url: 'http://localhost:8001/remoteEntry.js',
            }
          ]
        },
        {
          routes: []
          // Second app has no remotes!
        },
        {
          remotes: [
            {
              id: 'remote2',
              url: 'http://localhost:8002/remoteEntry.js',
            }
          ]
        }
      ]
    });

    mergeAppRemotes();

    expect(config.mergeRemotes).toHaveBeenCalledTimes(2);
    expect(config.mergeRemotes).toHaveBeenNthCalledWith(1, [
      {
        id: 'remote1',
        url: 'http://localhost:8001/remoteEntry.js',
      }
    ]);

    expect(config.mergeRemotes).toHaveBeenNthCalledWith(2, [
      {
        id: 'remote2',
        url: 'http://localhost:8002/remoteEntry.js',
      }
    ]);
  });
});
