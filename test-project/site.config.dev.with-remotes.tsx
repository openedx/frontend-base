import { defaultFooterConfig, defaultHeaderConfig, defaultShellConfig, EnvironmentTypes } from '@openedx/frontend-base';

import { ProjectSiteConfig } from '@openedx/frontend-base';
import { examplePageConfig, iframeWidgetConfig } from './src';
import './src/project.scss';

const config: ProjectSiteConfig = {
  apps: [
    defaultShellConfig,
    defaultHeaderConfig,
    defaultFooterConfig,
    examplePageConfig,
    iframeWidgetConfig,
  ],
  federatedApps: [
    {
      moduleId: 'authenticated-page',
      remoteId: 'testProject',
      hints: {
        paths: [
          '/authenticated',
        ]
      }
    }
  ],
  remotes: [
    {
      id: 'testProject',
      url: 'http://localhost:8081/remoteEntry.js',
    }
  ],
  environment: EnvironmentTypes.DEVELOPMENT,
  baseUrl: 'http://apps.local.openedx.io:8080',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',
  siteName: 'My Open edX Site',
  mfeConfigApiUrl: 'http://apps.local.openedx.io:8080/api/mfe_config/v1',
  appId: 'shell',
};

export default config;
