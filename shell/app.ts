import { getActiveRoles, getProvidesAsStrings, WidgetOperationTypes } from '../runtime';
import { App } from '../types';
import { Footer } from './footer';
import { Header } from './header';
import { providesChromelessRolesId } from './constants';

/*
 * Returns false when the current route should be chromeless (no header or
 * footer).  Apps request chromeless mode by listing their route roles under
 * providesChromelessRolesId in their `provides` entry, e.g.:
 *
 *   provides: { [providesChromelessRolesId]: ['org.openedx.frontend.role.authn'] }
 *
 * The widget is disabled when any of those roles is currently active.
 */
function isChromeVisible(): boolean {
  const activeRoles = getActiveRoles();
  const chromelessRoles = getProvidesAsStrings(providesChromelessRolesId);
  return !chromelessRoles.some(role => activeRoles.includes(role));
}

const app: App = {
  appId: 'org.openedx.frontend.app.shell',
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.header.main.v1',
      id: 'org.openedx.frontend.widget.header.main.v1',
      op: WidgetOperationTypes.APPEND,
      component: Header,
      condition: {
        callback: isChromeVisible,
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.main.v1',
      id: 'org.openedx.frontend.widget.footer.main.v1',
      op: WidgetOperationTypes.APPEND,
      component: Footer,
      condition: {
        callback: isChromeVisible,
      }
    },
  ]
};

export default app;
