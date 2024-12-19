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

  environment: EnvironmentTypes.PRODUCTION,
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',
  siteName: 'localhost',
  appId: 'shell',

  custom: {
    FALSE_VALUE: false,
    CORRECT_BOOL_VALUE: 'Good, false meant false.  We did not cast a boolean to a string.',
    INCORRECT_BOOL_VALUE: 'Why was a false boolean true?',
    INTEGER_VALUE: 123,
    EXAMPLE_VAR: 'Example Value',
  }
};

export default config;
