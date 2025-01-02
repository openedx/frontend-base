import { defaultFooterConfig, defaultHeaderConfig, defaultShellConfig, EnvironmentTypes, ProjectSiteConfig } from '@openedx/frontend-base';

import { authenticatedPageConfig, examplePageConfig, iframePluginConfig } from './src';
import './src/project.scss';

const config: ProjectSiteConfig = {
  apps: [
    defaultShellConfig,
    defaultHeaderConfig,
    defaultFooterConfig,
    examplePageConfig,
    authenticatedPageConfig,
    iframePluginConfig,
  ],

  environment: EnvironmentTypes.PRODUCTION,
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',
  siteName: 'localhost',
  appId: 'shell',
};

export default config;
