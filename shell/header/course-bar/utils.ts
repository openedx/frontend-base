import { matchPath } from 'react-router-dom';
import { getActiveRoles, getProvidesAsStrings, getUrlByRouteRole } from '../../../runtime';
import { providesCourseBarMasqueradeRolesId, providesCourseBarRolesId } from '../constants';

/*
 * Collects route role strings from all apps that opted into the course bar.
 * Each app declares its roles as a string array:
 *
 *   provides: {
 *     [providesCourseBarRolesId]: ['org.openedx.frontend.role.learning'],
 *   }
 */
function getCourseBarRoles(): string[] {
  return getProvidesAsStrings(providesCourseBarRolesId);
}

/*
 * Course-bar roles that additionally enable the masquerade widget.  Apps opt
 * in to the masquerade slot per-role on top of their course-bar declaration:
 *
 *   provides: {
 *     [providesCourseBarRolesId]: ['org.openedx.frontend.role.learning'],
 *     [providesCourseBarMasqueradeRolesId]: ['org.openedx.frontend.role.learning'],
 *   }
 *
 * A role only present in the masquerade list (without a matching course-bar
 * declaration) is ignored — masquerade is a refinement of the course bar,
 * not an independent feature.
 */
function getCourseBarMasqueradeRoles(): string[] {
  const courseBarRoles = new Set(getCourseBarRoles());
  return getProvidesAsStrings(providesCourseBarMasqueradeRolesId)
    .filter(role => courseBarRoles.has(role));
}

export function isCourseBarRoute(): boolean {
  const activeRoles = getActiveRoles();
  return getCourseBarRoles().some(role => activeRoles.includes(role));
}

export function isCourseBarMasqueradeRoute(): boolean {
  const activeRoles = getActiveRoles();
  return getCourseBarMasqueradeRoles().some(role => activeRoles.includes(role));
}

/*
 * Whether `pathname` is served by an in-app route (a registered route role
 * with a relative URL).  Drives the choice between react-router navigation
 * and a hard `window.location.assign` when the course bar redirects.
 */
export function isClientRoute(pathname: string): boolean {
  return getCourseBarRoles().some(role => {
    const routePath = getUrlByRouteRole(role);
    return routePath !== null
      && routePath.startsWith('/')
      && matchPath({ path: routePath, end: false }, pathname) !== null;
  });
}
