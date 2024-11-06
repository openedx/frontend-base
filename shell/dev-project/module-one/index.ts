import { createAppMenuItem, createUrlMenuItem } from '../../../runtime/config/menuConfigHelpers';
import { ApplicationModuleConfig } from '../../../types';
import { primaryLinks } from '../../header/defaults';
import ModuleOnePage from './ModuleOnePage';

const config: ApplicationModuleConfig = {
  header: {
    primaryLinks: [
      createUrlMenuItem('Child Link', '#'),
      ...primaryLinks,
    ],
    secondaryLinks: [
      createAppMenuItem('Child Help', 'support'),
    ],
  },
  route: {
    path: 'module-one',
    Component: ModuleOnePage,
  }
};

export default config;
