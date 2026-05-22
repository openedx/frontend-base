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
 *
 * Known limitation: if two entries in the query share identical { action, scope },
 * only the first matching key is mapped. Do not duplicate { action, scope } pairs.
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

  data.forEach((item) => {
    const key = Object.keys(query).find(
      (k) => query[k].action === item.action && query[k].scope === item.scope,
    ) as keyof Query | undefined;
    if (key !== undefined) {
      result[key] = item.allowed;
    }
  });

  // Default any key absent from the server response to false
  (Object.keys(query) as (keyof Query)[]).forEach((key) => {
    if (!(key in result)) {
      result[key] = false;
    }
  });

  return result;
};
