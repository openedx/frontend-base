import { App } from '../../../types';
import HomePage from './HomePage';
import messages from './i18n';

const app: App = {
  appId: 'org.openedx.frontend.app.dev.home',
  routes: [{
    path: '/',
    id: 'dev.home',
    Component: HomePage,
    handle: {
      role: 'home'
    }
  }],
  messages,
};

export default app;
