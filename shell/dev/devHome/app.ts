import { App } from '../../../types';
import HomePage from './HomePage';
import messages from './i18n';

const app: App = {
  appId: 'org.openedx.frontend.app.dev.home',
  routes: [{
    path: '/',
    id: 'org.openedx.frontend.route.dev.home',
    Component: HomePage,
    handle: {
      role: 'org.openedx.frontend.role.dev.home'
    }
  }],
  messages,
};

export default app;
