import { defaultFooterConfig, defaultHeaderConfig, defaultShellConfig, EnvironmentTypes, ProjectSiteConfig } from '@openedx/frontend-base';

import { authenticatedPageConfig, examplePageConfig, iframePluginConfig, pluginPageConfig } from './src';
import './src/project.scss';

const config: ProjectSiteConfig = {
  apps: [
    defaultShellConfig,
    defaultHeaderConfig,
    defaultFooterConfig,
    examplePageConfig,
    authenticatedPageConfig,
    pluginPageConfig,
    iframePluginConfig,
  ],

  ENVIRONMENT: EnvironmentTypes.PRODUCTION,
  BASE_URL: 'http://localhost:8080',
  CREDENTIALS_BASE_URL: 'http://localhost:18150',
  DISCOVERY_API_BASE_URL: 'http://localhost:18381',
  PUBLISHER_BASE_URL: 'http://localhost:18400',
  ECOMMERCE_BASE_URL: 'http://localhost:18130',
  LEARNER_DASHBOARD_URL: 'http://localhost:18000/dashboard',
  LMS_BASE_URL: 'http://localhost:18000',
  LOGIN_URL: 'http://localhost:18000/login',
  LOGOUT_URL: 'http://localhost:18000/logout',
  STUDIO_BASE_URL: 'http://localhost:18010',
  MARKETING_SITE_BASE_URL: 'http://localhost:18000',
  ORDER_HISTORY_URL: 'http://localhost:1996/orders',
  SITE_NAME: 'localhost',

  LOGO_URL: 'https://edx-cdn.org/v3/default/logo.svg',
  LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  LOGO_WHITE_URL: 'https://edx-cdn.org/v3/default/logo-white.svg',
  FAVICON_URL: 'https://edx-cdn.org/v3/default/favicon.ico',
  APP_ID: 'shell',

  custom: {
    FALSE_VALUE: false,
    CORRECT_BOOL_VALUE: 'Good, false meant false.  We did not cast a boolean to a string.',
    INCORRECT_BOOL_VALUE: 'Why was a false boolean true?',
    INTEGER_VALUE: 123,
    EXAMPLE_VAR: 'Example Value',
  }
};

export default config;
