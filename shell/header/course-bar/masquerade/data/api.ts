import { getSiteConfig, camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';

export type Role = 'staff' | 'student';

export interface ActiveMasqueradeData {
  role: Role,
  userName: string | null,
  userPartitionId: number | null,
  groupId: number | null,
  groupName: string | null,
}

export interface MasqueradeOption {
  name: string,
  role: Role,
  userName?: string,
  groupId?: number,
  userPartitionId?: number,
}

export interface MasqueradeStatus {
  success: boolean,
  error?: string,
  active: ActiveMasqueradeData,
  available: MasqueradeOption[],
}

export interface MasqueradePayload {
  role?: Role,
  user_name?: string,
  group_id?: number,
  user_partition_id?: number,
}

export async function getMasqueradeOptions(courseId: string): Promise<MasqueradeStatus> {
  const url = `${getSiteConfig().lmsBaseUrl}/courses/${courseId}/masquerade`;
  const { data } = await getAuthenticatedHttpClient().get(url, {});
  return camelCaseObject(data);
}

export async function postMasqueradeOptions(courseId: string, payload: MasqueradePayload): Promise<MasqueradeStatus> {
  const url = `${getSiteConfig().lmsBaseUrl}/courses/${courseId}/masquerade`;
  const { data } = await getAuthenticatedHttpClient().post(url, payload);
  return camelCaseObject(data);
}
