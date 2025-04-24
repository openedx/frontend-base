import { useCallback, useEffect } from 'react';
import { useMatches } from 'react-router';
import { setActiveRouteRoles } from '../../config';
import { isRoleRouteObject } from '../../routing';

const useActiveRouteRoleWatcher = () => {
  const matches = useMatches();

  // We create this callback so we can use it right away to populate the default state value.
  const findActiveRouteRoles = useCallback(() => {
    // Starts with the widget roles and adds the others in.
    const roles: string[] = [];

    // Route roles
    for (const match of matches) {
      if (isRoleRouteObject(match)) {
        if (!roles.includes(match.handle.role)) {
          roles.push(match.handle.role);
        }
      }
    }

    return roles;
  }, [matches]);

  useEffect(() => {
    setActiveRouteRoles(findActiveRouteRoles());
  }, [matches, findActiveRouteRoles]);
};

export default useActiveRouteRoleWatcher;
