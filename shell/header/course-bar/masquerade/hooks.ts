import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MessageDescriptor } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ActiveMasqueradeData,
  MasqueradeOption,
  MasqueradeStatus,
  MasqueradePayload,
  getMasqueradeOptions,
  postMasqueradeOptions,
} from './data/api';
import {
  CourseHomeCourseMetadata,
  courseHomeCourseMetadataQueryKey,
  findActiveTab,
  getCourseHomeCourseMetadata,
} from '../data/service';
import { isClientRoute } from '../utils';
import messages from './messages';

const defaultActive: ActiveMasqueradeData = {
  role: 'staff',
  groupId: null,
  groupName: null,
  userName: null,
  userPartitionId: null,
};

function toMasqueradePayload(option: MasqueradeOption): MasqueradePayload {
  const payload: MasqueradePayload = { role: option.role };
  if (option.groupId !== undefined && option.userPartitionId !== undefined) {
    payload.group_id = option.groupId;
    payload.user_partition_id = option.userPartitionId;
  }
  return payload;
}

/*
 * Whether `option` represents the active masquerade.  Three shapes:
 *   - userName defined: the "Specific Student..." prompt; active when the
 *     server says we're masquerading as some specific user.
 *   - groupId defined: a group option; active when the group ids match.
 *   - neither: a plain role option (e.g. Staff); active when no group/user
 *     is set.
 */
export function isOptionSelected(option: MasqueradeOption, active: ActiveMasqueradeData): boolean {
  if (option.role !== active.role) {
    return false;
  }
  if (option.userName !== undefined) {
    return active.userName !== null;
  }
  if (option.groupId !== undefined) {
    return option.groupId === active.groupId
      && option.userPartitionId === active.userPartitionId;
  }
  return active.userName === null && active.groupId === null;
}

interface HttpishError {
  customAttributes?: { httpErrorStatus?: number },
}

function getHttpStatus(error: unknown): number | undefined {
  return (error as HttpishError | null)?.customAttributes?.httpErrorStatus;
}

/*
 * The server tells us "no, you can't masquerade here" via either HTTP 403 or
 * a 200 with `success: false`.  Both mean: hide the bar entirely.  Other
 * failures (network, 5xx) are treated as "couldn't load" and surface as an
 * alert.
 */
function isQueryDenied(query: { isError: boolean, error: unknown, data: MasqueradeStatus | undefined }): boolean {
  if (query.isError) {
    return getHttpStatus(query.error) === 403;
  }
  return query.data !== undefined && !query.data.success;
}

/*
 * Errors are returned as MessageDescriptors when the frontend can pick the
 * message, or as a raw string when the server's `data.error` is more specific
 * than anything we'd hand-pick.  formatErrorMessage handles both at the
 * render site.
 */
export type MasqueradeErrorMessage = MessageDescriptor | string;

export function formatErrorMessage(
  formatMessage: (descriptor: MessageDescriptor) => string,
  error: MasqueradeErrorMessage,
): string {
  return typeof error === 'string' ? error : formatMessage(error);
}

function pickErrorMessage(
  query: { isError: boolean, error: unknown, data: MasqueradeStatus | undefined },
  mutation: { isError: boolean, error: unknown, data: MasqueradeStatus | undefined },
): MasqueradeErrorMessage | null {
  /* Denial is handled by hiding the bar; only surface truly-failed loads here. */
  if (query.isError && getHttpStatus(query.error) !== 403) {
    return messages.failedToLoadOptions;
  }
  if (mutation.isError) {
    return getHttpStatus(mutation.error) === 404
      ? messages.noStudentFound
      : messages.genericSubmitError;
  }
  if (mutation.data && !mutation.data.success) {
    return mutation.data.error || messages.genericSubmitError;
  }
  return null;
}

export interface MasqueradeState {
  active: ActiveMasqueradeData,
  available: MasqueradeOption[],
  pendingOption: MasqueradeOption | null,
  showUserNameInput: boolean,
  userName: string,
  setUserName: (value: string) => void,
  select: (option: MasqueradeOption) => void,
  submitUserName: () => void,
  errorMessage: MasqueradeErrorMessage | null,
  isSubmitting: boolean,
  isLoading: boolean,
  isDenied: boolean,
  isUnreachable: boolean,
}

export function useMasqueradeState(courseId: string): MasqueradeState {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  /*
   * Tracks the option the user just clicked, so the toggle and active-marker
   * can update before the server confirms.  Cleared once a mutation succeeds
   * (the server's active state becomes the truth) or replaced when the user
   * picks something else.
   */
  const [pendingOption, setPendingOption] = useState<MasqueradeOption | null>(null);
  const [userName, setUserName] = useState('');

  const query = useQuery({
    queryKey: ['masquerade', courseId],
    queryFn: () => getMasqueradeOptions(courseId),
  });

  const mutation = useMutation({
    mutationFn: (payload: MasqueradePayload) => postMasqueradeOptions(courseId, payload),
    onSuccess: async (data, payload) => {
      if (!data?.success) {
        /* Server rejected the pick.  Clear the optimistic pending state so the
         * UI snaps back to the real active option, except for userName
         * submissions where the input must stay open for retry. */
        if (payload.user_name === undefined) {
          setPendingOption(null);
        }
        return;
      }

      queryClient.invalidateQueries();

      /* The course-tabs metadata is the source of truth for "what pages this
       * user can see in this course."  Fetch the post-masquerade tabs and
       * redirect to the first one if the current path no longer appears. */
      const meta = await queryClient.fetchQuery<CourseHomeCourseMetadata>({
        queryKey: courseHomeCourseMetadataQueryKey(courseId),
        queryFn: () => getCourseHomeCourseMetadata(courseId),
      });
      const fallback = meta.tabs[0];
      if (!fallback) {
        return;
      }
      const stillVisible = findActiveTab(meta.tabs, location.pathname);
      if (stillVisible) {
        return;
      }
      const targetPath = new URL(fallback.url).pathname;
      if (isClientRoute(targetPath)) {
        navigate(targetPath, { replace: true });
      } else {
        window.location.assign(fallback.url);
      }
    },
    onError: (_error, payload) => {
      /* Same as the !success branch: revert the optimistic pick, but keep the
       * userName input open so the user can fix a typo and retry. */
      if (payload.user_name === undefined) {
        setPendingOption(null);
      }
    },
  });

  const active = (query.data?.success && query.data.active) || defaultActive;
  const available = (query.data?.success && query.data.available) || [];

  /*
   * Seed the input from active.userName once, on the first successful query.
   * After that the input belongs to the user — refetches (e.g. triggered by
   * a masquerade change in another tab) must not clobber what they typed.
   */
  const hasSeededRef = useRef(false);
  useEffect(() => {
    if (hasSeededRef.current || !query.isSuccess) {
      return;
    }
    hasSeededRef.current = true;
    if (active.userName) {
      setUserName(active.userName);
    }
  }, [query.isSuccess, active.userName]);

  /*
   * Clear pendingOption once the refetched active state actually reflects it.
   * Clearing in onSuccess instead would briefly flash the old active state
   * between mutation success and the refetch landing.
   */
  useEffect(() => {
    if (pendingOption && isOptionSelected(pendingOption, active)) {
      setPendingOption(null);
    }
  }, [pendingOption, active]);

  const showUserNameInput = active.userName !== null
    || pendingOption?.userName !== undefined;

  const errorMessage = pickErrorMessage(query, mutation);
  const isDenied = isQueryDenied(query);
  /* Query landed but we couldn't load options — bar shows but widget hides. */
  const isUnreachable = query.isError && getHttpStatus(query.error) !== 403;
  /* Loading until the first response (success or failure) lands. */
  const isLoading = query.isLoading;

  const select = (option: MasqueradeOption) => {
    /* Clear any prior mutation error so it doesn't leak into the new selection. */
    mutation.reset();
    setPendingOption(option);
    if (option.userName !== undefined) {
      setUserName(option.userName);
      return;
    }
    mutation.mutate(toMasqueradePayload(option));
  };

  const submitUserName = () => {
    mutation.mutate({ role: 'student', user_name: userName });
  };

  return {
    active,
    available,
    pendingOption,
    showUserNameInput,
    userName,
    setUserName,
    select,
    submitUserName,
    errorMessage,
    isSubmitting: mutation.isPending,
    isLoading,
    isDenied,
    isUnreachable,
  };
}
