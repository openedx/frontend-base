import { defaultFooterConfig, defaultHeaderConfig, defaultShellConfig, EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';
import { authenticatedPageConfig, examplePageConfig, iframeWidgetConfig } from './src';
import './src/site.scss';

const siteConfig: SiteConfig = {
  apps: [
    defaultShellConfig,
    defaultHeaderConfig,
    defaultFooterConfig,
    examplePageConfig,
    authenticatedPageConfig,
    iframeWidgetConfig,
  ],

  siteId: 'test',
  baseUrl: 'http://apps.local.openedx.io:8080',
  environment: EnvironmentTypes.DEVELOPMENT,
  siteName: 'My Open edX Site',

  // Frontend URLs
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  // API URLs
  lmsBaseUrl: 'http://local.openedx.io:8000',
  mfeConfigApiUrl: 'http://apps.local.openedx.io:8080/api/mfe_config/v1',
};

export default siteConfig;
