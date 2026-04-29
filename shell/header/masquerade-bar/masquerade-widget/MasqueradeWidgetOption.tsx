import React from 'react';
import { Dropdown } from '@openedx/paragon';
import { useMasqueradeContext } from './MasqueradeContext';
import type { Payload, Role } from './data/api';

interface Props {
  groupId?: number;
  groupName: string;
  role?: Role;
  userName?: string;
  userPartitionId?: number;
}

export const MasqueradeWidgetOption: React.FC<Props> = ({
  groupId = null,
  groupName,
  role = null,
  userName = null,
  userPartitionId = null,
}) => {
  const { active, onSubmit, userNameInputToggle } = useMasqueradeContext();

  const handleClick = React.useCallback(() => {
    if (userName || userName === '') {
      userNameInputToggle(true, groupId, groupName, role!, userName, userPartitionId);
      return false;
    }
    const payload: Payload = {};
    if (role) {
      payload.role = role;
    }
    if (groupId) {
      payload.group_id = groupId;
      payload.user_partition_id = userPartitionId!;
    }
    onSubmit(payload).then(() => {
      global.location.reload();
    });
    return true;
  }, [groupId, groupName, role, userName, userPartitionId, onSubmit, userNameInputToggle]);

  const isSelected = (
    groupId === active?.groupId
    && role === active?.role
    && userName === active?.userName
    && userPartitionId === active?.userPartitionId
  );

  if (!groupName) {
    return null;
  }

  const className = isSelected ? 'active' : '';
  return (
    <Dropdown.Item
      className={className}
      href="#"
      onClick={handleClick}
    >
      {groupName}
    </Dropdown.Item>
  );
};
