import { WidgetOperationTypes } from '../runtime';
import { App } from '../types';
import { Footer } from './footer';
import { Header } from './header';

const app: App = {
  appId: 'org.openedx.frontend.app.shell',
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.header.main.v1',
      id: 'org.openedx.frontend.widget.header.main.v1',
      op: WidgetOperationTypes.APPEND,
      component: Header,
      condition: {
        inactive: ['org.openedx.frontend.role.authn.main.v1'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.main.v1',
      id: 'org.openedx.frontend.widget.footer.main.v1',
      op: WidgetOperationTypes.APPEND,
      component: Footer,
      condition: {
        inactive: ['org.openedx.frontend.role.authn.main.v1'],
      }
    },
  ]
};

export default app;
