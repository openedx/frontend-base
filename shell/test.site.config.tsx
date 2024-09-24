import { ProjectSiteConfig } from '../types';

const config: ProjectSiteConfig = {
  apps: [],
  ACCOUNT_PROFILE_URL: 'http://localhost:1995',
  ACCOUNT_SETTINGS_URL: 'http://localhost:1997',
  BASE_URL: 'http://localhost:8080',
  CREDENTIALS_BASE_URL: 'http://localhost:18150',
  DISCOVERY_API_BASE_URL: 'http://localhost:18381',
  PUBLISHER_BASE_URL: 'http://localhost:18400',
  ECOMMERCE_BASE_URL: 'http://localhost:18130',
  LMS_BASE_URL: 'http://localhost:18000',
  LEARNING_BASE_URL: 'http://localhost:2000',
  LOGIN_URL: 'http://localhost:18000/login',
  LOGOUT_URL: 'http://localhost:18000/logout',
  STUDIO_BASE_URL: 'http://localhost:18010',
  MARKETING_SITE_BASE_URL: 'http://localhost:18000',
  ORDER_HISTORY_URL: 'http://localhost:1996/orders',
  SEGMENT_KEY: 'segment_whoa',
  SITE_NAME: 'edX',
  LOGO_URL: 'https://edx-cdn.org/v3/default/logo.svg',
  LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  LOGO_WHITE_URL: 'https://edx-cdn.org/v3/default/logo-white.svg',
  FAVICON_URL: 'https://edx-cdn.org/v3/default/favicon.ico',
  APP_ID: 'runtime',
  SUPPORT_URL: 'https://support.edx.org',
  ENVIRONMENT: 'test',
  // We include these for some tests that need them.
  SUPPORT_EMAIL: null,
  TERMS_OF_SERVICE_URL: null,
  PRIVACY_POLICY_URL: null,
  ACCESSIBILITY_URL: null,
};

export default config;
