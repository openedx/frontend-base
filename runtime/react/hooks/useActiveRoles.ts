import { useCallback, useState } from 'react';
import { getActiveRoles } from '../../config';
import { ACTIVE_ROLES_CHANGED } from '../../constants';
import useSiteEvent from './useSiteEvent';

const useActiveRoles = () => {
  const [roles, setRoles] = useState<string[]>(getActiveRoles());
  /* Stabilize the callback so useSiteEvent doesn't unsubscribe + resubscribe on every render.
     Every Slot in the tree subscribes via this hook, so the churn would be tree-wide. */
  const onChange = useCallback(() => {
    setRoles(getActiveRoles());
  }, []);
  useSiteEvent(ACTIVE_ROLES_CHANGED, onChange);

  return roles;
};

export default useActiveRoles;
