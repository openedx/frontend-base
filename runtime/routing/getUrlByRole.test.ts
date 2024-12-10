import getUrlByRole from './getUrlByRole';

describe('getUrlByRole', () => {
  it('returns the default path for an internal module', () => {
    expect(getUrlByRole('test-app-1')).toBe('/app1');
  });

  it('returns the path for a federated module', () => {
    expect(getUrlByRole('test-app-2')).toBe('/app2');
  });
});
