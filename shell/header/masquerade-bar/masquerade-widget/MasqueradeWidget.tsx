import React from 'react';
import { FormattedMessage, useIntl } from '@openedx/frontend-base';
import { Dropdown } from '@openedx/paragon';
import { useQuery, useMutation } from '@tanstack/react-query';

import { MasqueradeContext } from './MasqueradeContext';
import { MasqueradeUserNameInput } from './MasqueradeUserNameInput';
import { MasqueradeWidgetOption } from './MasqueradeWidgetOption';
import {
  ActiveMasqueradeData,
  getMasqueradeOptions,
  Payload,
  postMasqueradeOptions,
} from './data/api';
import messages from './messages';

interface Props {
  courseId: string,
  onError: (error: string) => void,
}

const defaultActive: ActiveMasqueradeData = {
  courseKey: '',
  role: 'staff',
  groupId: null,
  groupName: null,
  userName: null,
  userPartitionId: null,
};

export const MasqueradeWidget: React.FC<Props> = ({ courseId, onError }) => {
  const intl = useIntl();
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [shouldShowUserNameInput, setShouldShowUserNameInput] = React.useState(false);
  const [activeOverride, setActiveOverride] = React.useState<Partial<ActiveMasqueradeData> | null>(null);

  const { data, error: queryError } = useQuery({
    queryKey: ['masquerade', courseId],
    queryFn: () => getMasqueradeOptions(courseId),
  });

  // Handle network errors
  React.useEffect(() => {
    if (queryError) {
      // eslint-disable-next-line no-console
      console.error('Unable to get masquerade options', queryError);
    }
  }, [queryError]);

  // Handle success: false from the server
  React.useEffect(() => {
    if (data && !data.success) {
      onError('Unable to get masquerade options');
    }
  }, [data, onError]);

  // Derive active and available from query data
  const queryActive = (data?.success && data.active) || defaultActive;
  const active: ActiveMasqueradeData = activeOverride
    ? { ...queryActive, ...activeOverride }
    : queryActive;
  const available = (data?.success && data.available) || [];

  // Show username input when data loads with an active userName
  React.useEffect(() => {
    if (data?.success && queryActive.userName) {
      setAutoFocus(false);
      setShouldShowUserNameInput(true);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Payload) => postMasqueradeOptions(courseId, payload),
  });

  const handleSubmit = React.useCallback(async (payload: Payload) => {
    onError(''); // Clear any error
    return mutation.mutateAsync(payload);
  }, [courseId, onError, mutation.mutateAsync]);

  const toggle = React.useCallback((
    show: boolean | undefined,
    groupId: number | null,
    groupName: string,
    role: 'staff' | 'student',
    userName: string,
    userPartitionId: number | null,
  ) => {
    setAutoFocus(true);
    setShouldShowUserNameInput((prev) => (show === undefined ? !prev : show));
    setActiveOverride({
      groupId,
      groupName,
      role,
      userName,
      userPartitionId,
    });
  }, []);

  const contextValue = React.useMemo(() => ({
    active, onSubmit: handleSubmit, onError, userNameInputToggle: toggle,
  }), [active, handleSubmit, onError, toggle]);

  const specificLearnerInputText = intl.formatMessage(messages.placeholder);
  return (
    <MasqueradeContext.Provider value={contextValue}>
      <div className="flex-grow-1">
        <div className="row">
          <span className="col-auto col-form-label pl-3"><FormattedMessage {...messages.titleViewAs} /></span>
          <Dropdown className="flex-shrink-1 mx-1">
            <Dropdown.Toggle id="masquerade-widget-toggle" variant="inverse-outline-primary">
              {active.groupName ?? active.userName ?? intl.formatMessage(messages.titleStaff)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {available.map(group => (
                <MasqueradeWidgetOption
                  groupId={group.groupId}
                  groupName={group.name}
                  key={group.name}
                  role={group.role}
                  userName={group.userName}
                  userPartitionId={group.userPartitionId}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {shouldShowUserNameInput && (
          <div className="row mt-2">
            <span className="col-auto col-form-label pl-3" id="masquerade-search-label">{`${specificLearnerInputText}:`}</span>
            <MasqueradeUserNameInput
              id="masquerade-search"
              className="col-4"
              autoFocus={autoFocus}
              defaultValue={active.userName ?? ''}
            />
          </div>
        )}
      </div>
    </MasqueradeContext.Provider>
  );
};
