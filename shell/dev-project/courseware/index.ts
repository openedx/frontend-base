import { createAppMenuItem, createUrlMenuItem } from '../../../runtime/config/menuConfigHelpers';
import { ApplicationModuleConfig } from '../../../types';
import { primaryLinks } from '../../header/defaults';
import CoursewarePage from './CoursewarePage';

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
    path: 'courseware',
    Component: CoursewarePage,
  }
};

export default config;
