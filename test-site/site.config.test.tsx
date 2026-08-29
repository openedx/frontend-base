import { EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';

import { examplePageConfig } from './src';

const siteConfig: SiteConfig = {
  siteId: 'test',
  siteName: 'Test Site',
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',

  environment: EnvironmentTypes.TEST,
  apps: [
    examplePageConfig,
  ],
};

export default siteConfig;
