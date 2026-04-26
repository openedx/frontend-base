import { useEffect } from 'react';
import { useMatches } from 'react-router';
import { setActiveRouteRoles } from '../../config';
import { isRoleRouteObject } from '../../routing';

const useActiveRouteRoleWatcher = () => {
  const matches = useMatches();

  useEffect(() => {
    const roles: string[] = [];
    for (const match of matches) {
      if (isRoleRouteObject(match)) {
        for (const role of match.handle.roles) {
          if (!roles.includes(role)) {
            roles.push(role);
          }
        }
      }
    }
    setActiveRouteRoles(roles);
  }, [matches]);
};

export default useActiveRouteRoleWatcher;
