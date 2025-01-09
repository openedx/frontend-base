import { getUrlByRouteRole } from './utils';

describe('getUrlByRouteRole', () => {
  it('returns the default path for an internal module', () => {
    expect(getUrlByRouteRole('test-app-1')).toBe('/app1');
  });

  it('returns the path for a federated module', () => {
    expect(getUrlByRouteRole('test-app-2')).toBe('/app2');
  });
});
