import { ApplicationModuleConfig } from '../../../types';
import HomePage from './HomePage';
import messages from './i18n';

const config: ApplicationModuleConfig = {
  route: {
    path: '/',
    Component: HomePage,
  },
  messages,
};

export default config;
