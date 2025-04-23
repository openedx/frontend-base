import { EnvironmentTypes, ProjectSiteConfig } from '../types';

const config: ProjectSiteConfig = {
  apps: [
    {
      routes: [
        {
          path: '/app1',
          element: (
            <div>Test App 1</div>
          ),
          handle: {
            role: 'test-app-1'
          }
        }
      ]
    },
  ],
  federatedApps: [
    {
      moduleId: 'testApp2',
      remoteId: 'remoteApps',
      rolePaths: {
        'test-app-2': '/app2',
      }
    },
  ],
  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
  baseUrl: 'http://localhost:8080',
  csrfTokenApiPath: '/csrf/api/v1/token',
  languagePreferenceCookieName: 'openedx-language-preference',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',
  refreshAccessTokenApiPath: '/login_refresh',
  segmentKey: 'segment_whoa',
  siteName: 'edX',
  userInfoCookieName: 'edx-user-info',
  appId: 'runtime',
  environment: EnvironmentTypes.TEST,
  ignoredErrorRegex: null,
  publicPath: '/'
};

export default config;
