import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getAuthenticatedHttpClient } from '../auth';
import { usePermissions, permissionsQueryKeys } from './hooks';

jest.mock('../auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

const BASE_URL = 'http://lms.example.com';
const QUERY = {
  canView: { action: 'courses.view_grading_settings', scope: 'course-v1:org+course+run' },
  canEdit: { action: 'courses.edit_grading_settings', scope: 'course-v1:org+course+run' },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePermissions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns actual server values when featureEnabled is true', async () => {
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue({
        data: [
          { action: 'courses.view_grading_settings', scope: 'course-v1:org+course+run', allowed: true },
          { action: 'courses.edit_grading_settings', scope: 'course-v1:org+course+run', allowed: false },
        ],
      }),
    });

    const { result } = renderHook(
      () => usePermissions(QUERY, true, { apiBaseUrl: BASE_URL }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.canView).toBe(true);
    expect(result.current.canEdit).toBe(false);
    expect(result.current.isAuthzEnabled).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('returns all keys as true and makes no API call when featureEnabled is false', () => {
    const postMock = jest.fn();
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({ post: postMock });

    const { result } = renderHook(
      () => usePermissions(QUERY, false, { apiBaseUrl: BASE_URL }),
      { wrapper: createWrapper() },
    );

    expect(postMock).not.toHaveBeenCalled();
    expect(result.current.canView).toBe(true);
    expect(result.current.canEdit).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isAuthzEnabled).toBe(false);
  });

  it('defaults absent server keys to false when featureEnabled is true', async () => {
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue({ data: [] }),
    });

    const { result } = renderHook(
      () => usePermissions(QUERY, true, { apiBaseUrl: BASE_URL }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.canView).toBe(false);
    expect(result.current.canEdit).toBe(false);
  });

  it('spreads permission keys at the top level — no nested .permissions object', async () => {
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue({
        data: [
          { action: 'courses.view_grading_settings', scope: 'course-v1:org+course+run', allowed: true },
        ],
      }),
    });

    const { result } = renderHook(
      () => usePermissions(QUERY, true, { apiBaseUrl: BASE_URL }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect('canView' in result.current).toBe(true);
    expect('permissions' in result.current).toBe(false);
  });

  it('returns undefined permission keys and isLoading=true while the API call is in flight', async () => {
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
      post: jest.fn(() => new Promise(() => {})), // never resolves
    });

    const { result } = renderHook(
      () => usePermissions(QUERY, true, { apiBaseUrl: BASE_URL }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.canView).toBeUndefined();
    expect(result.current.canEdit).toBeUndefined();
  });

  it('sets isError=true and defaults all keys to false when the API call fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockRejectedValue(new Error('network error')),
    });

    const { result } = renderHook(
      () => usePermissions(QUERY, true, { apiBaseUrl: BASE_URL }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.canView).toBe(false);
    expect(result.current.canEdit).toBe(false);
    jest.restoreAllMocks();
  });

  it('scopes cache by apiBaseUrl — different base URLs produce distinct query keys', () => {
    const keyA = permissionsQueryKeys.validate(QUERY, 'http://lms-a.example.com');
    const keyB = permissionsQueryKeys.validate(QUERY, 'http://lms-b.example.com');
    expect(keyA).not.toEqual(keyB);
  });
});
