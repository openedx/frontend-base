import { useState } from 'react';
import { getActiveRoles } from '../../config';
import { ACTIVE_ROLES_CHANGED } from '../../constants';
import useSiteEvent from './useSiteEvent';

const useActiveRoles = () => {
  const [roles, setRoles] = useState<string[]>(getActiveRoles());
  useSiteEvent(ACTIVE_ROLES_CHANGED, () => {
    setRoles(getActiveRoles());
  });

  return roles;
};

export default useActiveRoles;
