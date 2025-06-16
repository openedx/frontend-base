import { App } from '../../../types';
import HomePage from './HomePage';
import messages from './i18n';

const app: App = {
  appId: 'org.openedx.frontend.app.devSite.home',
  routes: [{
    path: '/',
    id: 'dev-site.home',
    Component: HomePage,
    handle: {
      role: 'home'
    }
  }],
  messages,
};

export default app;
