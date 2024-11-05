import { EnvironmentTypes, ProjectSiteConfig } from '../types';

const config: ProjectSiteConfig = {
  apps: [],
  ACCOUNT_PROFILE_URL: 'http://localhost:1995',
  ACCOUNT_SETTINGS_URL: 'http://localhost:1997',
  APP_ID: 'runtime',
  BASE_URL: 'http://localhost:8080',
  CREDENTIALS_BASE_URL: 'http://localhost:18150',
  DISCOVERY_API_BASE_URL: 'http://localhost:18381',
  ECOMMERCE_BASE_URL: 'http://localhost:18130',
  ENVIRONMENT: EnvironmentTypes.TEST,
  FAVICON_URL: 'https://edx-cdn.org/v3/default/favicon.ico',
  LEARNER_DASHBOARD_URL: 'http://localhost:18000/dashboard',
  LEARNING_BASE_URL: 'http://localhost:2000',
  LMS_BASE_URL: 'http://localhost:18000',
  LOGIN_URL: 'http://localhost:18000/login',
  LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  LOGO_URL: 'https://edx-cdn.org/v3/default/logo.svg',
  LOGO_WHITE_URL: 'https://edx-cdn.org/v3/default/logo-white.svg',
  LOGOUT_URL: 'http://localhost:18000/logout',
  MARKETING_SITE_BASE_URL: 'http://localhost:18000',
  ORDER_HISTORY_URL: 'http://localhost:1996/orders',
  PUBLISHER_BASE_URL: 'http://localhost:18400',
  SEGMENT_KEY: 'segment_whoa',
  SITE_NAME: 'edX',
  STUDIO_BASE_URL: 'http://localhost:18010',
  SUPPORT_URL: 'https://support.edx.org',
  // We include these for some tests that need them.
  SUPPORT_EMAIL: null,
  TERMS_OF_SERVICE_URL: null,
  PRIVACY_POLICY_URL: null,
  ACCESSIBILITY_URL: null,
};

export default config;
