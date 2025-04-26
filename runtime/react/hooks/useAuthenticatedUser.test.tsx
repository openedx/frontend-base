import { act, renderHook } from '@testing-library/react';
import { setAuthenticatedUser } from '../../auth';
import { initializeMockApp } from '../../testing';
import SiteProvider from '../SiteProvider';
import useAuthenticatedUser from './useAuthenticatedUser';

describe('useAuthenticatedUser', () => {
  it('returns null when the user is anonymous', () => {
    const { result } = renderHook(() => useAuthenticatedUser());
    expect(result.current).toBeNull();
  });

  describe('with a user', () => {
    const user = {
      administrator: true,
      email: 'admin@example.com',
      name: 'Admin',
      roles: ['admin'],
      userId: 1,
      username: 'admin-user',
      avatar: 'http://localhost/admin.png',
    };

    beforeEach(() => {
      initializeMockApp({
        authenticatedUser: user,
      });
    });

    afterEach(() => {
      act(() => {
        setAuthenticatedUser(null);
      });
    });

    it('returns a User when the user exists', () => {
      const { result } = renderHook(() => useAuthenticatedUser(), { wrapper: SiteProvider });
      expect(result.current).toBe(user);
    });
  });
});
