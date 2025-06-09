import { getUrlByRouteRole } from './utils';

describe('getUrlByRouteRole', () => {
  it('returns the default path for an internal module', () => {
    expect(getUrlByRouteRole('test-app-1')).toBe('/app1');
  });
});
