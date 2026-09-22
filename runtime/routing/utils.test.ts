import { Link } from 'react-router-dom';

import { getLinkProps, getUrlByRouteRole, isInternalUrl, resolveRouteByRole } from './utils';
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
          handle: { roles: ['test-app-1'] },
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
              handle: { roles: ['org.openedx.frontend.role.login'] },
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

describe('isInternalUrl', () => {
  it('accepts a path in this site', () => {
    expect(isInternalUrl('/account')).toBe(true);
    expect(isInternalUrl('/')).toBe(true);
  });

  it('rejects absolute and protocol-relative URLs', () => {
    expect(isInternalUrl('https://example.com/account')).toBe(false);
    expect(isInternalUrl('//example.com/account')).toBe(false);
    expect(isInternalUrl('mailto:help@example.com')).toBe(false);
  });
});

describe('resolveRouteByRole', () => {
  beforeEach(() => {
    mockGetSiteConfig.mockReturnValue({
      apps: [{
        appId: 'test-app',
        routes: [
          { path: '/account', handle: { roles: ['account'] } },
          { path: '/gradebook/:courseId', handle: { roles: ['gradebook'] } },
          { path: '/learning/:courseId/:unitId?', handle: { roles: ['learning'] } },
          { path: '/learner-dashboard/*', handle: { roles: ['dashboard'] } },
          { path: '/*', handle: { roles: ['catch-all'] } },
        ],
      }],
      externalRoutes: [{
        role: 'profile',
        url: 'https://apps.example.com/profile/',
      }],
    } as any);
  });

  it('resolves an app route to a path in this site', () => {
    expect(resolveRouteByRole('account')).toEqual({ url: '/account', isInternal: true });
  });

  it('substitutes route params, optional ones included', () => {
    expect(resolveRouteByRole('gradebook', { courseId: 'course-v1:edX+DemoX+Demo_Course' }))
      .toEqual({ url: '/gradebook/course-v1:edX+DemoX+Demo_Course', isInternal: true });
    expect(resolveRouteByRole('learning', { courseId: 'c1', unitId: 'u1' }))
      .toEqual({ url: '/learning/c1/u1', isInternal: true });
  });

  it('drops an optional param that is not given', () => {
    expect(resolveRouteByRole('learning', { courseId: 'c1' })).toEqual({ url: '/learning/c1', isInternal: true });
  });

  it('throws when a required param is not given', () => {
    expect(() => resolveRouteByRole('gradebook')).toThrow('Missing ":courseId" param');
  });

  it('drops a trailing splat', () => {
    expect(resolveRouteByRole('dashboard')).toEqual({ url: '/learner-dashboard', isInternal: true });
    expect(resolveRouteByRole('catch-all')).toEqual({ url: '/', isInternal: true });
  });

  it('resolves an external route to its URL as configured', () => {
    expect(resolveRouteByRole('profile', { courseId: 'c1' }))
      .toEqual({ url: 'https://apps.example.com/profile/', isInternal: false });
  });

  it('returns null when nothing provides the role', () => {
    expect(resolveRouteByRole('nonexistent')).toBeNull();
  });
});

describe('getLinkProps', () => {
  it('links a path in this site through react-router', () => {
    expect(getLinkProps('/account')).toEqual({ as: Link, to: '/account' });
  });

  it('links anything else through a plain anchor', () => {
    expect(getLinkProps('https://example.com/account')).toEqual({ href: 'https://example.com/account' });
    expect(getLinkProps('//example.com/account')).toEqual({ href: '//example.com/account' });
  });
});
