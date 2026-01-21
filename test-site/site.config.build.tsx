import { footerApp, headerApp, shellApp, EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';

import { authenticatedPageConfig, examplePageConfig, iframeWidgetConfig } from './src';

import './src/site.scss';

const siteConfig: SiteConfig = {
  siteId: 'test',
  siteName: 'Test Site',
  baseUrl: 'http://apps.local.openedx.io:8080',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.PRODUCTION,
  runtimeConfigJsonUrl: 'http://apps.local.openedx.io:8080/api/mfe_config/v1',
  apps: [
    shellApp,
    headerApp,
    footerApp,
    examplePageConfig,
    authenticatedPageConfig,
    iframeWidgetConfig,
  ],
};

export default siteConfig;
