import { AppConfigTypes, EnvironmentTypes, ProjectSiteConfig } from '../types';

const config: ProjectSiteConfig = {
  apps: {
    'test-app-1': {
      type: AppConfigTypes.INTERNAL,
      config: {
        route: {
          path: '/app1',
          element: (
            <div>Test App 1</div>
          )
        }
      }
    },
    'test-app-2': {
      type: AppConfigTypes.INTERNAL,
      path: '/overridePathApp2',
      config: {
        route: {
          path: '/app2',
          element: (
            <div>Test App 2</div>
          )
        }
      }
    },
    'test-app-3': {
      type: AppConfigTypes.FEDERATED,
      path: '/app3',
      libraryId: 'testLibrary',
      moduleId: 'TestApp3',
      remoteUrl: 'http://localhost/testLibrary/remoteEntry.js'
    },
    'test-app-4': {
      type: AppConfigTypes.EXTERNAL,
      url: 'http://localhost/testApp4',
    }
  },
  ACCESS_TOKEN_COOKIE_NAME: 'edx-jwt-cookie-header-payload',
  ACCOUNT_PROFILE_URL: 'http://localhost:1995',
  ACCOUNT_SETTINGS_URL: 'http://localhost:1997',
  BASE_URL: 'http://localhost:8080',
  CREDENTIALS_BASE_URL: 'http://localhost:18150',
  CSRF_TOKEN_API_PATH: '/csrf/api/v1/token',
  DISCOVERY_API_BASE_URL: 'http://localhost:18381',
  PUBLISHER_BASE_URL: 'http://localhost:18400',
  ECOMMERCE_BASE_URL: 'http://localhost:18130',
  LANGUAGE_PREFERENCE_COOKIE_NAME: 'openedx-language-preference',
  LEARNER_DASHBOARD_URL: 'http://localhost:18000/dashboard',
  LEARNING_BASE_URL: 'http://localhost:2000',
  LMS_BASE_URL: 'http://localhost:18000',
  LOGIN_URL: 'http://localhost:18000/login',
  LOGOUT_URL: 'http://localhost:18000/logout',
  STUDIO_BASE_URL: 'http://localhost:18010',
  MARKETING_SITE_BASE_URL: 'http://localhost:18000',
  ORDER_HISTORY_URL: 'http://localhost:1996/orders',
  REFRESH_ACCESS_TOKEN_API_PATH: '/login_refresh',
  SEGMENT_KEY: 'segment_whoa',
  SITE_NAME: 'edX',
  USER_INFO_COOKIE_NAME: 'edx-user-info',
  LOGO_URL: 'https://edx-cdn.org/v3/default/logo.svg',
  LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  LOGO_WHITE_URL: 'https://edx-cdn.org/v3/default/logo-white.svg',
  FAVICON_URL: 'https://edx-cdn.org/v3/default/favicon.ico',
  APP_ID: 'runtime',
  SUPPORT_URL: 'https://support.edx.org',
  ENVIRONMENT: EnvironmentTypes.TEST,
  IGNORED_ERROR_REGEX: null,
  PUBLIC_PATH: '/'
};

export default config;
