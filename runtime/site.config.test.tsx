import { EnvironmentTypes, SiteConfig } from '../types';

const siteConfig: SiteConfig = {
  siteId: 'runtime',
  siteName: 'edX',
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',
  environment: EnvironmentTypes.TEST,
  apps: [{
    appId: 'test-app',
    routes: [{
      path: '/app1',
      element: (
        <div>Test App 1</div>
      ),
      handle: {
        role: 'test-app-1'
      }
    }]
  }],
  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
  csrfTokenApiPath: '/csrf/api/v1/token',
  languagePreferenceCookieName: 'openedx-language-preference',
  refreshAccessTokenApiPath: '/login_refresh',
  segmentKey: 'segment_whoa',
  userInfoCookieName: 'edx-user-info',
  ignoredErrorRegex: null,
  publicPath: '/'
};

export default siteConfig;
