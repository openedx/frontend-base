import { EnvironmentTypes, SiteConfig } from '../types';
import { devFooterApp, devHeaderApp, devHomeApp, devUserApp, slotShowcaseApp } from './dev';
import { footerApp, headerApp, shellApp } from '.';

import './app.scss';

const siteConfig: SiteConfig = {
  apps: [
    shellApp,
    headerApp,
    footerApp,
    devUserApp,
    devHomeApp,
    devHeaderApp,
    devFooterApp,
    slotShowcaseApp,
  ],

  externalRoutes: [
    {
      role: 'profile',
      url: 'http://apps.local.openedx.io:1995/profile/'
    },
    {
      role: 'account',
      url: 'http://apps.local.openedx.io:1997/account/'
    },
    {
      role: 'logout',
      url: 'http://local.openedx.io:8000/logout'
    },
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

export default siteConfig;
