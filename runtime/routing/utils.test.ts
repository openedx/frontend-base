import { getUrlByRouteRole } from './utils';
import { getSiteConfig } from '../config';

jest.mock('../config');

const mockGetSiteConfig = getSiteConfig as jest.MockedFunction<typeof getSiteConfig>;

describe('getUrlByRouteRole', () => {
  it('returns the path for an internal app route', () => {
    mockGetSiteConfig.mockReturnValue({
      apps: [{
        appId: 'test-app',
        routes: [{
          path: '/app1',
          handle: { role: 'test-app-1' },
        }],
      }],
    } as any);

    expect(getUrlByRouteRole('test-app-1')).toBe('/app1');
  });

  it('returns the full path for a nested child route', () => {
    mockGetSiteConfig.mockReturnValue({
      apps: [{
        appId: 'authn',
        routes: [{
          path: '/authn',
          children: [
            {
              path: 'login',
              handle: { role: 'org.openedx.frontend.role.login' },
            },
          ],
        }],
      }],
    } as any);

    expect(getUrlByRouteRole('org.openedx.frontend.role.login')).toBe('/authn/login');
  });

  it('returns the full URL for an external route', () => {
    mockGetSiteConfig.mockReturnValue({
      apps: [],
      externalRoutes: [{
        role: 'org.openedx.frontend.role.login',
        url: 'https://auth.example.com/login',
      }],
    } as any);

    expect(getUrlByRouteRole('org.openedx.frontend.role.login')).toBe('https://auth.example.com/login');
  });

  it('returns null when no matching role is found', () => {
    mockGetSiteConfig.mockReturnValue({
      apps: [],
      externalRoutes: [],
    } as any);

    expect(getUrlByRouteRole('nonexistent')).toBeNull();
  });
});
