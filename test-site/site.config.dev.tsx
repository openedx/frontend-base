import { defaultFooterConfig, defaultHeaderConfig, defaultShellConfig, EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';

import { authenticatedPageConfig, examplePageConfig, iframeWidgetConfig } from './src';

import './src/site.scss';

const siteConfig: SiteConfig = {
  siteId: 'test',
  siteName: 'Test Site',
  baseUrl: 'http://apps.local.openedx.io:8080',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  mfeConfigApiUrl: 'http://apps.local.openedx.io:8080/api/mfe_config/v1',
  apps: [
    defaultShellConfig,
    defaultHeaderConfig,
    defaultFooterConfig,
    examplePageConfig,
    authenticatedPageConfig,
    iframeWidgetConfig,
  ],
};

export default siteConfig;
