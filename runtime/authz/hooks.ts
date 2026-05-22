import { skipToken, useQuery } from '@tanstack/react-query';
import { getSiteConfig } from '../config';
import type { PermissionValidationQuery, PermissionValidationAnswer } from './types';
import { validatePermissions } from './api';

export const permissionsQueryKeys = {
  all: ['authz'] as const,
  validate: (query: PermissionValidationQuery, apiBaseUrl: string = getSiteConfig().lmsBaseUrl) =>
    [...permissionsQueryKeys.all, 'validatePermissions', apiBaseUrl, query] as const,
};

export interface UsePermissionsOptions {
  /** Default false — authz returns definitive answers; retrying 403s wastes requests. */
  retry?: boolean | number,
  /**
   * Base URL of the backend running openedx-authz.
   * Defaults to getSiteConfig().lmsBaseUrl when omitted.
   * Pass explicitly when the authz service requires a different backend (e.g. Studio).
   */
  apiBaseUrl?: string,
}

/**
 * Intersection return type: metadata fields plus every permission key spread at the top level.
 * Consumers destructure permission keys directly, no nested from `permissions.*` object.
 *
 * @example
 * const { isLoading, canViewGradingSettings, canEditGradingSettings } =
 *   usePermissions(query, featureEnabled);
 */
export type UsePermissionsResult<Query extends PermissionValidationQuery> = {
  isLoading: boolean,
  isAuthzEnabled: boolean,
} & PermissionValidationAnswer<Query>;

/**
 * Queries the openedx-authz service for the given permissions.
 *
 * When featureEnabled is false: no API call is made; all permission keys return true,
 * preserving the pre-authz behavior during gradual rollout.
 * When featureEnabled is true: hits the authz API; returns actual server values.
 *
 * The caller is responsible for reading its own waffle flag and passing the result
 * as featureEnabled — waffle flag differ per MFE
 *
 * @param query          - Key/value map of permission check descriptors.
 * @param featureEnabled - Pass the result of your waffle flag check here.
 * @param options        - Optional retry and apiBaseUrl settings.
 *
 * @example
 * const { enableAuthzCourseAuthoring } = useWaffleFlags(courseId);
 * const { isLoading, canViewGrading, canEditGrading } = usePermissions(
 *   { canViewGrading: { action: 'courses.view_grading_settings', scope: courseId },
 *     canEditGrading: { action: 'courses.edit_grading_settings', scope: courseId } },
 *   enableAuthzCourseAuthoring ?? false,
 *   { apiBaseUrl: getConfig().LMS_BASE_URL },
 * );
 */
export const usePermissions = <Query extends PermissionValidationQuery>(
  query: Query,
  featureEnabled: boolean,
  options: UsePermissionsOptions = {},
): UsePermissionsResult<Query> => {
  const { retry = false, apiBaseUrl = getSiteConfig().lmsBaseUrl } = options;

  const { isLoading, data } = useQuery<PermissionValidationAnswer<Query>, Error>({
    queryKey: permissionsQueryKeys.validate(query, apiBaseUrl),
    queryFn: featureEnabled ? () => validatePermissions(apiBaseUrl, query) : skipToken,
    retry,
  });

  const permissionResults = isLoading
    ? ({} as PermissionValidationAnswer<Query>)
    : (Object.keys(query) as (keyof Query)[]).reduce(
        (acc, key) => {
          acc[key] = featureEnabled ? (data?.[key] ?? false) : true;
          return acc;
        },
        {} as PermissionValidationAnswer<Query>,
      );

  return {
    isLoading: featureEnabled ? isLoading : false,
    isAuthzEnabled: featureEnabled,
    ...permissionResults,
  } as UsePermissionsResult<Query>;
};
