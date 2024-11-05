import { ApplicationModuleConfig } from '../../../types';
import DashboardPage from './DashboardPage';

const config: ApplicationModuleConfig = {
  route: {
    path: 'dashboard',
    Component: DashboardPage,
  }
};

export default config;
