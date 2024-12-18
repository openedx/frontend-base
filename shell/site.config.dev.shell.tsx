import { EnvironmentTypes, ProjectSiteConfig } from '../types';
import defaultShellConfig from './defaultShellConfig';
import footerConfig from './dev-project/footer/footerConfig';
import headerConfig from './dev-project/header/headerConfig';
import homeConfig from './dev-project/home';
import userConfig from './dev-project/user/userConfig';
import defaultFooterConfig from './footer/defaultFooterConfig';
import defaultHeaderConfig from './header/defaultHeaderConfig';

import './app.scss';

const config: ProjectSiteConfig = {
  apps: [
    defaultShellConfig,
    defaultHeaderConfig,
    defaultFooterConfig,
    userConfig,
    homeConfig,
    headerConfig,
    footerConfig,
  ],
  externalRoutes: [
    {
      role: 'logout',
      url: 'http://local.openedx.io:8000/logout'
    }
  ],

  // General
  APP_ID: 'shell',
  BASE_URL: 'http://apps.local.openedx.io:8080',
  ENVIRONMENT: EnvironmentTypes.DEVELOPMENT,
  SITE_NAME: 'My Open edX Site',

  // Frontend URLs
  LOGIN_URL: 'http://local.openedx.io:8000/login',
  STUDIO_BASE_URL: 'http://studio.local.openedx.io:8001',
  LOGOUT_URL: 'http://local.openedx.io:8000/logout',

  // API URLs
  LMS_BASE_URL: 'http://local.openedx.io:8000',
  MFE_CONFIG_API_URL: 'http://apps.local.openedx.io:8080/api/mfe_config/v1',

  // Brand URLs
  FAVICON_URL: 'https://edx-cdn.org/v3/default/favicon.ico',
  LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  LOGO_URL: 'https://edx-cdn.org/v3/default/logo.svg',
  LOGO_WHITE_URL: 'https://edx-cdn.org/v3/default/logo-white.svg',
};

export default config;
