import { defaultFooterConfig, defaultHeaderConfig, defaultShellConfig, EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';

import { authenticatedPageConfig, examplePageConfig, iframeWidgetConfig } from './src';
import './src/site.scss';

const config: SiteConfig = {
  apps: [
    defaultShellConfig,
    defaultHeaderConfig,
    defaultFooterConfig,
    examplePageConfig,
    authenticatedPageConfig,
    iframeWidgetConfig,
  ],

  environment: EnvironmentTypes.PRODUCTION,
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',
  siteName: 'localhost',
  siteId: 'test',
};

export default config;
