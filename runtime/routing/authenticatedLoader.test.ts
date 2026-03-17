import { redirect } from 'react-router';
import authenticatedLoader from './authenticatedLoader';
import { getAuthenticatedUser, getLoginRedirectUrl } from '../auth';
import { getUrlByRouteRole } from './utils';

jest.mock('react-router', () => ({
  redirect: jest.fn((url: string) => ({ type: 'redirect', url })),
}));

jest.mock('../auth');
jest.mock('./utils');

const mockGetAuthenticatedUser = getAuthenticatedUser as jest.MockedFunction<typeof getAuthenticatedUser>;
const mockGetUrlByRouteRole = getUrlByRouteRole as jest.MockedFunction<typeof getUrlByRouteRole>;
const mockGetLoginRedirectUrl = getLoginRedirectUrl as jest.MockedFunction<typeof getLoginRedirectUrl>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

const mockLocationAssign = jest.fn();

function makeLoaderArgs(url: string) {
  return {
    request: { url } as any,
    params: {},
  };
}

describe('authenticatedLoader', () => {
  const originalLocation = global.location;

  beforeAll(() => {
    Object.defineProperty(global, 'location', {
      value: {
        origin: 'https://example.com',
        href: 'https://example.com/current-page',
        pathname: '/current-page',
        assign: mockLocationAssign,
      },
      writable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(global, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when user is authenticated', () => {
    mockGetAuthenticatedUser.mockReturnValue({
      administrator: false,
      email: 'test@example.com',
      name: 'Test User',
      roles: ['student'],
      userId: 123,
      username: 'testuser',
      avatar: 'https://example.com/avatar.jpg',
    });

    const result = authenticatedLoader(makeLoaderArgs('https://example.com/dashboard'));

    expect(result).toBeNull();
    expect(mockLocationAssign).not.toHaveBeenCalled();
    expect(mockGetUrlByRouteRole).not.toHaveBeenCalled();
  });

  it('returns SPA redirect with ?next derived from request URL, not global.location', () => {
    mockGetAuthenticatedUser.mockReturnValue(null);
    mockGetUrlByRouteRole.mockReturnValue('/login');

    authenticatedLoader(makeLoaderArgs('https://example.com/dashboard'));

    expect(mockRedirect).toHaveBeenCalledWith('/login?next=%2Fdashboard');
    expect(mockLocationAssign).not.toHaveBeenCalled();
  });

  it('calls location.assign for a cross-origin login route', () => {
    mockGetAuthenticatedUser.mockReturnValue(null);
    mockGetUrlByRouteRole.mockReturnValue('https://auth.example.com/login');
    mockGetLoginRedirectUrl.mockReturnValue('https://auth.example.com/login?next=%2Fdashboard');

    const result = authenticatedLoader(makeLoaderArgs('https://example.com/dashboard'));

    expect(mockGetLoginRedirectUrl).toHaveBeenCalledWith('https://example.com/dashboard');
    expect(mockLocationAssign).toHaveBeenCalledWith('https://auth.example.com/login?next=%2Fdashboard');
    expect(result).toBeInstanceOf(Promise);
  });

  it('falls back to location.assign when no login role is found', () => {
    mockGetAuthenticatedUser.mockReturnValue(null);
    mockGetUrlByRouteRole.mockReturnValue(null);
    mockGetLoginRedirectUrl.mockReturnValue('https://auth.example.com/login?next=%2Fdashboard');

    const result = authenticatedLoader(makeLoaderArgs('https://example.com/dashboard'));

    expect(mockGetLoginRedirectUrl).toHaveBeenCalledWith('https://example.com/dashboard');
    expect(mockLocationAssign).toHaveBeenCalledWith('https://auth.example.com/login?next=%2Fdashboard');
    expect(result).toBeInstanceOf(Promise);
  });
});
