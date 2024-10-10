import { renderHook } from '@testing-library/react-hooks';
import { EnvironmentTypes } from '../../types';
import { sendTrackEvent } from '../analytics';
import { setAuthenticatedUser } from '../auth';
import { initializeMockApp } from '../testing';
import AppProvider from './AppProvider';
import { useAuthenticatedUser, useConfig, useTrackColorSchemeChoice } from './hooks';

jest.mock('../analytics');

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
let matchesMock;

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    matches: matchesMock,
  })),
});

describe('useTrackColorSchemeChoice hook', () => {
  afterEach(() => {
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    sendTrackEvent.mockClear();
  });

  it('sends dark preferred color schema event if query matches', async () => {
    matchesMock = true;
    renderHook(() => useTrackColorSchemeChoice());

    expect(sendTrackEvent).toHaveBeenCalledTimes(1);
    expect(sendTrackEvent).toHaveBeenCalledWith(
      'openedx.ui.frontend-base.prefers-color-scheme.selected',
      { preferredColorScheme: 'dark' },
    );
  });

  it('sends light preferred color schema event if query does not match', async () => {
    matchesMock = false;
    renderHook(() => useTrackColorSchemeChoice());

    expect(sendTrackEvent).toHaveBeenCalledTimes(1);
    expect(sendTrackEvent).toHaveBeenCalledWith(
      'openedx.ui.frontend-base.prefers-color-scheme.selected',
      { preferredColorScheme: 'light' },
    );
  });

  it('adds change event listener to matchMedia query', async () => {
    renderHook(() => useTrackColorSchemeChoice());

    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

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
      setAuthenticatedUser(null);
    });

    it('returns a User when the user exists', () => {
      const { result } = renderHook(() => useAuthenticatedUser(), { wrapper: AppProvider });
      expect(result.current).toBe(user);
    });
  });
});

describe('useConfig', () => {
  it('returns the site config', () => {
    const { result } = renderHook(() => useConfig());
    expect(result.current).toHaveProperty('apps', []);
    expect(result.current).toHaveProperty('ENVIRONMENT', EnvironmentTypes.TEST);
    expect(result.current).toHaveProperty('BASE_URL', 'http://localhost:8080');
  });
});
