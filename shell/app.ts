import { WidgetOperationTypes } from '../runtime';
import { App } from '../types';
import { Footer } from './footer';
import { Header } from './header';

const inactive = [
  'org.openedx.frontend.role.login',
  'org.openedx.frontend.role.register',
  'org.openedx.frontend.role.resetPassword',
  'org.openedx.frontend.role.confirmPassword',
  'org.openedx.frontend.role.welcome'
];

const app: App = {
  appId: 'org.openedx.frontend.app.shell',
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.header.main.v1',
      id: 'org.openedx.frontend.widget.header.main.v1',
      op: WidgetOperationTypes.APPEND,
      component: Header,
      condition: {
        inactive,
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.main.v1',
      id: 'org.openedx.frontend.widget.footer.main.v1',
      op: WidgetOperationTypes.APPEND,
      component: Footer,
      condition: {
        inactive,
      }
    },
  ]
};

export default app;
