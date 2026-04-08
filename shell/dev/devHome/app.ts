import { App } from '../../../types';
import HomePage from './HomePage';

const app: App = {
  appId: 'org.openedx.frontend.app.dev.home',
  routes: [{
    path: '/',
    id: 'org.openedx.frontend.route.dev.home',
    Component: HomePage,
    handle: {
      role: 'org.openedx.frontend.role.devHome'
    }
  }],
};

export default app;
