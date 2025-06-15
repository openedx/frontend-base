import { EnvironmentTypes, SiteConfig } from '../types';
import defaultShellConfig from './defaultShellConfig';
import defaultFooterConfig from './footer/defaultFooterConfig';
import defaultHeaderConfig from './header/defaultHeaderConfig';

import footerConfig from './dev-site/footer/footerConfig';
import headerConfig from './dev-site/header/headerConfig';
import homeConfig from './dev-site/home';
import slotShowcaseConfig from './dev-site/slot-showcase';
import userConfig from './dev-site/user/userConfig';

import './app.scss';

const config: SiteConfig = {
  apps: [
    defaultShellConfig,
    defaultHeaderConfig,
    defaultFooterConfig,
    userConfig,
    homeConfig,
    headerConfig,
    footerConfig,
    slotShowcaseConfig,
  ],
  externalRoutes: [
    {
      role: 'logout',
      url: 'http://local.openedx.io:8000/logout'
    }
  ],

  // General
  siteId: 'shell',
  siteName: 'My Open edX Site',
  baseUrl: 'http://apps.local.openedx.io:8080',
  environment: EnvironmentTypes.DEVELOPMENT,

  // Frontend URLs
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  // API URLs
  lmsBaseUrl: 'http://local.openedx.io:8000',
  mfeConfigApiUrl: 'http://apps.local.openedx.io:8080/api/mfe_config/v1',
};

export default config;
