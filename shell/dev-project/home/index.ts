import { App } from '../../../types';
import HomePage from './HomePage';
import messages from './i18n';

const app: App = {
  routes: [{
    path: '/',
    id: 'dev-project.home',
    Component: HomePage,
    handle: {
      role: 'home'
    }
  }],
  messages,
};

export default app;
