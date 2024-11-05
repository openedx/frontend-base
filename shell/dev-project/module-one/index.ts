import { primaryLinks } from '../../header/defaults';
import ModuleOnePage from './ModuleOnePage';

const config = {
  header: {
    primaryLinks: [
      {
        label: 'Child Link',
        url: '#'
      },
      ...primaryLinks,
    ],
    secondaryLinks: [
      {
        label: 'Child Help',
        appId: 'support',
      }
    ],
  },
  route: {
    path: 'module-one',
    Component: ModuleOnePage,
  }
};

export default config;
