import { primaryLinks } from '../../header/defaults';
import { createAppMenuItem, createUrlMenuItem } from '../../menus/data/configHelpers';
import ModuleOnePage from './ModuleOnePage';

const config = {
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
