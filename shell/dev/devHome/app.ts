import { App } from '../../../types';
import { homeRole } from '../../constants';
import HomePage from './HomePage';

const app: App = {
  appId: 'org.openedx.frontend.app.dev.home',
  routes: [{
    path: '/dev',
    id: 'org.openedx.frontend.route.dev.home',
    Component: HomePage,
    handle: {
      roles: [homeRole],
    }
  }],
};

export default app;
