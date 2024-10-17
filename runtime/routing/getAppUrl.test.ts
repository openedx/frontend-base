import getAppUrl from './getAppUrl';

describe('getAppUrl', () => {
  it('returns the default path for an internal module', () => {
    expect(getAppUrl('test-app-1')).toBe('/app1');
  });

  it('returns the override path for an internal module', () => {
    expect(getAppUrl('test-app-2')).toBe('/overridePathApp2');
  });

  it('returns the path for a federated module', () => {
    expect(getAppUrl('test-app-3')).toBe('/app3');
  });

  it('returns the fully qualified URL for an external module', () => {
    expect(getAppUrl('test-app-4')).toBe('http://localhost/testApp4');
  });
});
