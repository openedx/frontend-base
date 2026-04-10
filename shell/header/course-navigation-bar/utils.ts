import { matchPath } from 'react-router-dom';
import { getActiveRoles, getProvidesAsStrings, getUrlByRouteRole } from '../../../runtime';
import { providesCourseNavigationRolesId } from '../constants';

/*
 * Collects route role strings from all apps that opted into the course
 * navigation bar feature.  Each app declares its roles as a string array:
 *
 *   provides: {
 *     [providesCourseNavigationRolesId]: ['org.openedx.frontend.role.learning'],
 *   }
 */
function getCourseNavigationBarRoles(): string[] {
  return getProvidesAsStrings(providesCourseNavigationRolesId);
}

export function isCourseNavigationRoute(): boolean {
  const activeRoles = getActiveRoles();
  return getCourseNavigationBarRoles().some(role => activeRoles.includes(role));
}

export function isClientRoute(pathname: string): boolean {
  return getCourseNavigationBarRoles().some(role => {
    const routePath = getUrlByRouteRole(role);
    return routePath !== null
      && routePath.startsWith('/')
      && matchPath({ path: routePath, end: false }, pathname) !== null;
  });
}
