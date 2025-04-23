import { mergeConfig } from '../../runtime';
import { getFederationRemotes } from './getFederationRemotes';

describe('getFederationRemotes', () => {
  let getTimeOriginal: () => number = () => {
    return 123;
  };
  beforeEach(() => {
    getTimeOriginal = Date.prototype.getTime;
    Date.prototype.getTime = jest.fn(() => 123);
  });

  afterEach(() => {
    Date.prototype.getTime = getTimeOriginal;
  });

  it('should return an empty array when there are no remotes', () => {
    const remotes = getFederationRemotes();
    expect(remotes).toEqual([]);
  });

  it('should return a formatted remotes when there are remotes', () => {
    const remotes = [
      {
        id: 'remote1',
        url: 'http://localhost:8001/remoteEntry.js',
      },
      {
        id: 'remote2',
        url: 'http://localhost:8002/remoteEntry.js',
      }
    ];
    mergeConfig({
      remotes
    });

    const result = getFederationRemotes();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'remote1',
      entry: 'http://localhost:8001/remoteEntry.js?123'
    });
    expect(result[1]).toEqual({
      name: 'remote2',
      entry: 'http://localhost:8002/remoteEntry.js?123'
    });
  });

  it('should throw an error if a remote ID is not a valid variable name', () => {
    const remotes = [
      {
        id: 'remote1',
        url: 'http://localhost:8001/remoteEntry.js',
      },
      {
        id: 'remote-2', // This is an invalid name because it contains a '-'
        url: 'http://localhost:8002/remoteEntry.js',
      }
    ];
    mergeConfig({
      remotes
    });

    expect(
      () => getFederationRemotes()
    ).toThrowErrorMatchingSnapshot();
  });
});
