export interface ExternalAppConfig {
  appId: string,
  url: string,
}

export interface InternalAppConfig {
  appId: string,
  component: () => JSX.Element,
  path: string,
  config?: {
    [key: string]: any,
  }
}

export interface FederatedAppConfig {
  appId: string,
  remoteUrl: string,
  moduleId: string,
  path: string,
  config?: {
    [key: string]: any,
  }
}

export interface SiteConfig {
  apps: Array<ExternalAppConfig | InternalAppConfig | FederatedAppConfig>,

  // Cookies
  ACCESS_TOKEN_COOKIE_NAME?: string,
  LANGUAGE_PREFERENCE_COOKIE_NAME?: string,
  USER_INFO_COOKIE_NAME?: string,

  // Paths
  CSRF_TOKEN_API_PATH?: string,
  REFRESH_ACCESS_TOKEN_API_PATH?: string,

  // Logging
  IGNORED_ERROR_REGEX?: RegExp | null,

  // Analytics
  SEGMENT_KEY?: string | null,

  // General
  APP_ID: string,
  BASE_URL: string,
  ENVIRONMENT?: string,
  MFE_CONFIG_API_URL?: string | null,
  PUBLIC_PATH?: string,
  SITE_NAME: string,

  // Apps
  ACCOUNT_PROFILE_URL: string,
  ACCOUNT_SETTINGS_URL: string,
  LEARNING_BASE_URL: string,
  LOGIN_URL: string,
  LOGOUT_URL: string,
  MARKETING_SITE_BASE_URL: string,
  ORDER_HISTORY_URL?: string | null,
  SUPPORT_URL?: string | null,

  // Backends
  CREDENTIALS_BASE_URL: string,
  DISCOVERY_API_BASE_URL: string,
  ECOMMERCE_BASE_URL: string,
  LMS_BASE_URL: string,
  PUBLISHER_BASE_URL: string,
  STUDIO_BASE_URL: string,

  // Branding
  FAVICON_URL: string,
  LOGO_TRADEMARK_URL: string,
  LOGO_URL: string,
  LOGO_WHITE_URL: string,

  custom?: {
    [key:string]: any,
  }
}

export interface ModuleConfig {
  modules?: Array<string>,
  name?: string,
  plugins?: any,
  custom?: {
    [key:string]: any,
  }
}

export interface User {
  username: string,
  userId: string,
  roles: Array<string>,
  administrator: boolean,
}
