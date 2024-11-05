import { Button } from '@openedx/paragon';

import { createExternalAppConfig, createInternalAppConfig, Divider } from '../runtime';
import { EnvironmentTypes, ProjectSiteConfig } from '../types';
import CoursesLink from './dev-project/header/CoursesLink';
import homeConfig from './dev-project/home';
import learnerDashboardConfig from './dev-project/learner-dashboard';
import moduleOneConfig from './dev-project/module-one';
import './index.scss';
import {
  createAppMenuItem,
  createComponentMenuItem,
  createDropdownMenuItem,
  createLabeledMenu,
  createUrlMenuItem
} from './menus/data/configHelpers';

const config: ProjectSiteConfig = {
  apps: [
    createInternalAppConfig('home', homeConfig),
    createInternalAppConfig('moduleOne', moduleOneConfig),
    createInternalAppConfig('learnerDashboard', learnerDashboardConfig),
    createExternalAppConfig('support', 'https://local.openedx.io:8000/support'),
    createExternalAppConfig('logout', 'http://local.openedx.io:8000/logout'),
  ],
  header: {
    primaryLinks: [
      createAppMenuItem(<CoursesLink />, 'learnerDashboard'),
      createUrlMenuItem('Other', '#'),
      createDropdownMenuItem('Dropdown', [
        createUrlMenuItem('Item #1', '#'),
        createComponentMenuItem(<Divider />),
        createUrlMenuItem('Item #2', '#'),
      ]),
    ],
    secondaryLinks: [
      createAppMenuItem('Help', 'support'),
    ],
  },
  footer: {
    centerLinks: [
      createLabeledMenu('First Column', [
        createUrlMenuItem('Link 1', '#'),
        createUrlMenuItem('Link 2', '#'),
        createUrlMenuItem('Link 3', '#'),
      ]),
      createLabeledMenu('Second Column', [
        createUrlMenuItem('Link 4', '#'),
        createUrlMenuItem('Link 5', '#'),
        createUrlMenuItem('Link 6 With A Long Label', '#'),
        createUrlMenuItem('Link 7', '#'),
      ]),
      createLabeledMenu('Third Column', [
        createUrlMenuItem('Link 8', '#'),
        createUrlMenuItem('Link 9 With Another Longer Label', '#'),
      ]),
      createLabeledMenu('Fourth Column', [
        createUrlMenuItem('Link 10', '#'),
        createUrlMenuItem('Link 11', '#'),
      ]),
    ],
    revealMenu: createLabeledMenu('I Reveal Buttons', [
      createComponentMenuItem(<Button>Button One</Button>),
      createComponentMenuItem(<Button>Button Two</Button>),
      createUrlMenuItem('Link Three', '#'),
    ]),
  },

  APP_ID: 'shell',
  ACCOUNT_PROFILE_URL: 'http://apps.local.openedx.io:1995',
  ACCOUNT_SETTINGS_URL: 'http://apps.local.openedx.io:1997',
  BASE_URL: 'http://apps.local.openedx.io:8080',
  ENVIRONMENT: EnvironmentTypes.DEVELOPMENT,
  FAVICON_URL: 'https://edx-cdn.org/v3/default/favicon.ico',
  LEARNER_DASHBOARD_URL: 'http://local.openedx.io:8000/dashboard',
  LEARNING_BASE_URL: 'http://apps.local.openedx.io:2000',
  LMS_BASE_URL: 'http://local.openedx.io:8000',
  LOGIN_URL: 'http://local.openedx.io:8000/login',
  LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  LOGO_URL: 'https://edx-cdn.org/v3/default/logo.svg',
  LOGO_WHITE_URL: 'https://edx-cdn.org/v3/default/logo-white.svg',
  LOGOUT_URL: 'http://local.openedx.io:8000/logout',
  MARKETING_SITE_BASE_URL: 'http://local.openedx.io:8000',
  MFE_CONFIG_API_URL: 'http://apps.local.openedx.io:8080/api/mfe_config/v1',
  ORDER_HISTORY_URL: 'http://apps.local.openedx.io:1996/orders',
  SITE_NAME: 'My Open edX Site',
  STUDIO_BASE_URL: 'http://studio.local.openedx.io:8001',
};

export default config;
