import { getActiveRoles, getProvidesAsStrings } from '../../../runtime';
import { providesMasqueradeBarRolesId } from '../constants';

/*
 * Collects route role strings from all apps that opted into the course
 * navigation bar feature.  Each app declares its roles as a string array:
 *
 *   provides: {
 *     [providesMasqueradeBarRolesId]: ['org.openedx.frontend.role.learning'],
 *   }
 */
function getMasqueradeBarRoles(): string[] {
  return getProvidesAsStrings(providesMasqueradeBarRolesId);
}

export function isMasqueradeBarRoute(): boolean {
  const activeRoles = getActiveRoles();
  return getMasqueradeBarRoles().some(role => activeRoles.includes(role));
}
