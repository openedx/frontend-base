import { getAuthenticatedHttpClient } from '../auth';
import type {
  PermissionValidationQuery,
  PermissionValidationAnswer,
  PermissionValidationRequestItem,
  PermissionValidationResponseItem,
} from './types';

export const PERMISSIONS_VALIDATE_PATH = '/api/authz/v1/permissions/validate/me';

/**
 * Validates whether the currently authenticated user holds the requested permissions
 * against the openedx-authz backend.
 *
 * @param apiBaseUrl - Base URL of the backend running openedx-authz (e.g. getConfig().LMS_BASE_URL).
 * @param query      - Key/value map of permission check descriptors.
 * @returns Map of the same keys to boolean allowed values.
 *          Any key absent from the server response resolves to false.
 */
export const validatePermissions = async <Query extends PermissionValidationQuery>(
  apiBaseUrl: string,
  query: Query,
): Promise<PermissionValidationAnswer<Query>> => {
  const request: PermissionValidationRequestItem[] = Object.values(query);

  const { data }: { data: PermissionValidationResponseItem[] }
    = await getAuthenticatedHttpClient().post(
      `${apiBaseUrl}${PERMISSIONS_VALIDATE_PATH}`,
      request,
    );

  const result = {} as PermissionValidationAnswer<Query>;

  for (const [key, reqItem] of Object.entries(query) as [keyof Query, PermissionValidationRequestItem][]) {
    const match = data.find(
      (item) => item.action === reqItem.action && item.scope === reqItem.scope,
    );
    result[key] = match ? match.allowed : false;
  }
  return result;
};
