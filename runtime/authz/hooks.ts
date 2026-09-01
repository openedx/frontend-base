import { skipToken, useQuery } from '@tanstack/react-query';
import { getSiteConfig } from '../config';
import type { PermissionValidationQuery, PermissionValidationAnswer } from './types';
import { validatePermissions } from './api';

/**
 * TanStack Query cache key factory for permission queries.
 * Use `validate` to scope cache reads and invalidations to a specific
 * query + backend combination.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: permissionsQueryKeys.validate(myQuery) });
 */
export const permissionsQueryKeys = {
  all: ['authz'] as const,
  validate: (query: PermissionValidationQuery, apiBaseUrl: string = getSiteConfig().lmsBaseUrl) =>
    [...permissionsQueryKeys.all, 'validatePermissions', apiBaseUrl, query] as const,
};

export interface UsePermissionsOptions {
  /** Default false — authz returns definitive answers; retrying 403s wastes requests. */
  retry?: boolean | number;
  /**
   * Base URL of the backend running openedx-authz.
   * Defaults to getSiteConfig().lmsBaseUrl when omitted.
   * Pass explicitly when the authz service requires a different backend (e.g. Studio).
   */
  apiBaseUrl?: string;
  /**
   * How long (in ms) the cached result is considered fresh before TanStack Query refetches.
   * Defaults to 5 minutes. Use permissionsQueryKeys to invalidate manually when user roles
   * change mid-session.
   */
  staleTime?: number;
}

/**
 * Intersection return type: metadata fields plus every permission key spread at the top level.
 * Consumers destructure permission keys directly — no nested `.permissions` object.
 *
 * @example
 * const { enableAuthz } = useWaffleFlags(courseId);
 * const { isLoading, isError, canViewGrading, canEditGrading } = usePermissions(
 *   { canViewGrading: { action: 'courses.view_grading_settings', scope: courseId },
 *     canEditGrading: { action: 'courses.edit_grading_settings', scope: courseId } },
 *   enableAuthz ?? false,
 *   { apiBaseUrl: getSiteConfig().lmsBaseUrl },
 * );
 */
export type UsePermissionsResult<Query extends PermissionValidationQuery> = {
  isLoading: boolean;
  isError: boolean;
  /** True while the request is paused because the browser is offline; isLoading is also true. */
  isPaused: boolean;
  error: Error | null;
  isAuthzEnabled: boolean;
} & { [K in keyof Query]: boolean | undefined };

/**
 * Queries the openedx-authz service for the given permissions.
 *
 * When featureEnabled is false: no API call is made; all permission keys return true,
 * preserving the pre-authz behavior during gradual rollout.
 * When featureEnabled is true: posts to the authz API and maps each key in the query
 * to the allowed boolean from the server response. Keys absent from the response default
 * to false. Keys are undefined while the request is unresolved — in flight, or paused
 * because the browser is offline (check isLoading first).
 *
 * The caller is responsible for reading its own waffle flag and passing the resolved
 * boolean as featureEnabled. The hook is agnostic to how that boolean was derived —
 * whether from a global flag, a per-course override, or a per-org override, the behavior
 * is the same. Waffle flag names differ per MFE.
 *
 * See https://docs.openedx.org/projects/openedx-authz/en/latest/concepts/core_roles_and_permissions/index.html
 * for the available permission you can query.
 *
 * @param query          - Key/value map of permission check descriptors.
 * @param featureEnabled - Pass the result of your waffle flag check here.
 * @param options        - Optional retry, apiBaseUrl, and staleTime settings.
 *
 * @example
 * const { enableAuthzCourseAuthoring } = useWaffleFlags(courseId);
 * const { isLoading, canViewGrading, canEditGrading } = usePermissions(
 *   { canViewGrading: { action: 'courses.view_grading_settings', scope: courseId },
 *     canEditGrading: { action: 'courses.edit_grading_settings', scope: courseId } },
 *   enableAuthzCourseAuthoring ?? false,
 *   { apiBaseUrl: getSiteConfig().lmsBaseUrl },
 * );
 */
export const usePermissions = <Query extends PermissionValidationQuery>(
  query: Query,
  featureEnabled: boolean,
  options: UsePermissionsOptions = {},
): UsePermissionsResult<Query> => {
  const {
    retry = false,
    apiBaseUrl = getSiteConfig().lmsBaseUrl,
    // staleTime defaults to 5 min
    staleTime = 5 * 60 * 1000
  } = options;

  const {
    isPending, isPaused, isError, error, data,
  } = useQuery<PermissionValidationAnswer<Query>, Error>({
    queryKey: permissionsQueryKeys.validate(query, apiBaseUrl),
    queryFn: featureEnabled ? () => validatePermissions(apiBaseUrl, query) : skipToken,
    retry,
    staleTime,
  });

  // isPending, not isLoading: isLoading is `isPending && isFetching`, so a query paused
  // because the browser is offline reports isLoading: false with no data — a consumer
  // following the isLoading/isError/deny sequence would deny access instead of waiting.
  // featureEnabled gates it so a disabled consumer is never treated as loading, even when
  // it shares a cache key with an enabled consumer whose fetch is in flight.
  const isPermissionsLoading = featureEnabled && isPending;

  const permissionResults = isPermissionsLoading
    ? ({} as PermissionValidationAnswer<Query>)
    : (Object.keys(query) as (keyof Query)[]).reduce(
        (acc, key) => {
          acc[key] = featureEnabled ? (data?.[key] ?? false) : true;
          return acc;
        },
        {} as PermissionValidationAnswer<Query>,
      );

  return {
    isLoading: isPermissionsLoading,
    isError: featureEnabled && isError,
    isPaused: featureEnabled && isPaused,
    error: featureEnabled ? error : null,
    isAuthzEnabled: featureEnabled,
    ...permissionResults,
  } as UsePermissionsResult<Query>;
};
