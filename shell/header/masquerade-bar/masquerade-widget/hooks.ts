import { useMemo, useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import type { MessageDescriptor } from 'react-intl';
import {
  ActiveMasqueradeData,
  getMasqueradeOptions,
  MasqueradeOption,
  MasqueradeStatus,
  Payload,
  postMasqueradeOptions,
} from './data/api';
import messages from './messages';

const defaultActive: ActiveMasqueradeData = {
  courseKey: '',
  role: 'staff',
  groupId: null,
  groupName: null,
  userName: null,
  userPartitionId: null,
};

export interface UseMasqueradeWidgetReturn {
  active: ActiveMasqueradeData,
  available: MasqueradeOption[],
  queryErrorMessage: MessageDescriptor | null,
  mutationErrorMessage: MessageDescriptor | string | null,
  isPending: boolean,
  select: (option: MasqueradeOption) => void,
  selectedOptionName: string | null,
  userName: string,
  setUserName: (value: string) => void,
  handleUserNameSubmit: () => void,
  showUserNameInput: boolean,
  autoFocus: boolean,
}

function toPayload(option: MasqueradeOption): Payload {
  const payload: Payload = {};
  if (option.role) {
    payload.role = option.role;
  }
  if (option.groupId) {
    payload.group_id = option.groupId;
    payload.user_partition_id = option.userPartitionId;
  }
  return payload;
}

export function useMasqueradeWidget(courseId: string): UseMasqueradeWidgetReturn {
  const queryClient = useQueryClient();

  const [userNameInputToggled, setUserNameInputToggled] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [userName, setUserName] = useState('');
  // Local selection state — set immediately on click, independent of the API.
  const [localSelectedName, setLocalSelectedName] = useState<string | null>(null);

  const { data, error: queryError } = useQuery({
    queryKey: ['masquerade', courseId],
    queryFn: () => getMasqueradeOptions(courseId),
  });

  const mutation = useMutation({
    mutationFn: (payload: Payload) => postMasqueradeOptions(courseId, payload),
    onSuccess: (responseData) => {
      if (responseData.success) {
        queryClient.invalidateQueries();
      }
    },
  });

  const active: ActiveMasqueradeData = (data?.success && data.active) || defaultActive;
  const available: MasqueradeOption[] = useMemo(
    () => (data?.success && data.available) || [],
    [data],
  );

  // If the user hasn't clicked anything yet, derive the selected name from
  // the server's active state. Once the user clicks, localSelectedName takes over.
  const serverSelectedName = useMemo(() => {
    if (!data?.success) return null;
    const match = available.find(
      (opt) => (opt.role === active.role)
        && ((opt.groupId ?? null) === active.groupId)
        && ((opt.userName ?? null) === active.userName),
    );
    return match?.name ?? null;
  }, [data, available, active]);

  const selectedOptionName = localSelectedName ?? serverSelectedName;

  useEffect(() => {
    setUserName(active.userName ?? '');
  }, [active.userName]);

  const queryErrorMessage: MessageDescriptor | null = (queryError || (data && !data.success))
    ? messages.fetchError
    : null;

  const mutationErrorMessage: MessageDescriptor | string | null = mutation.error
    ? messages.genericError
    : (mutation.data && !mutation.data.success
        ? (mutation.data.error || messages.genericError)
        : null);

  const showUserNameInput = userNameInputToggled || Boolean(active.userName);

  const { mutateAsync, reset: resetMutation } = mutation;

  const submitPayload = useCallback(async (payload: Payload) => {
    resetMutation();
    try {
      return await mutateAsync(payload);
    } catch {
      return undefined as unknown as MasqueradeStatus;
    }
  }, [mutateAsync, resetMutation]);

  const select = useCallback((option: MasqueradeOption) => {
    // Immediately update the selected state — no API dependency.
    setLocalSelectedName(option.name);
    if (option.userName !== undefined) {
      setAutoFocus(true);
      setUserNameInputToggled(true);
      return;
    }
    setUserNameInputToggled(false);
    submitPayload(toPayload(option));
  }, [submitPayload]);

  const handleUserNameSubmit = useCallback(() => {
    if (!userName.trim()) return;
    submitPayload({ role: 'student', user_name: userName.trim() });
  }, [userName, submitPayload]);

  return useMemo(() => ({
    active,
    available,
    queryErrorMessage,
    mutationErrorMessage,
    isPending: mutation.isPending,
    select,
    selectedOptionName,
    userName,
    setUserName,
    handleUserNameSubmit,
    showUserNameInput,
    autoFocus,
  }), [active, available, queryErrorMessage, mutationErrorMessage, mutation.isPending, select, selectedOptionName, userName, handleUserNameSubmit, showUserNameInput, autoFocus]);
}
