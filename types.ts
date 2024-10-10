import { ElementType } from 'react';
import { RouteObject } from 'react-router';

export type AppConfig = ExternalAppConfig | InternalAppConfig | FederatedAppConfig;

export enum AppConfigTypes {
  EXTERNAL = 'external',
  INTERNAL = 'internal',
  FEDERATED = 'federated',
}

export interface ExternalAppConfig {
  type: AppConfigTypes.EXTERNAL,
  appId: string,
  moduleId: string,
  url: string,
}

export interface ApplicationModuleConfig {
  routes: Array<RouteObject>
}

export interface InternalAppConfig {
  type: AppConfigTypes.INTERNAL,
  appId: string,
  config: ApplicationModuleConfig,
}

export interface FederatedAppConfig {
  type: AppConfigTypes.FEDERATED,
  appId: string,
  remoteUrl: string,
  moduleId: string,
  path: string,
}
/**
 * Defines the changes to be made to either the default widget(s) or to any
 * that are inserted.
 */
export enum PluginOperations {
  /**
   * Inserts a new widget into the DirectPluginSlot.
   */
  INSERT = 'insert',
  /**
   * Used to hide a default widget based on the widgetId.
   */
  HIDE = 'hide',
  /**
   * Used to modify/replace a widget's content.
   */
  MODIFY = 'modify',
  /**
   * Wraps a widget with a React element or fragment.
   */
  WRAP = 'wrap',
}

export enum PluginTypes {
  IFRAME = 'iframe',
  DIRECT = 'direct',
}

export interface InsertDirectPluginWidget {
  id: string,
  type: PluginTypes.DIRECT,
  priority: number,
  RenderWidget: ElementType,
  content?: {
    [propName: string]: any,
  }
}

export interface InsertIframePluginWidget {
  id: string,
  type: PluginTypes.IFRAME,
  priority: number,
  url: string,
  title: string,
}

export type InsertPluginWidget = InsertDirectPluginWidget | InsertIframePluginWidget;

export type PluginWidget = InsertPluginWidget;

export interface ModifyPlugin {
  op: PluginOperations.MODIFY,
  widgetId: string,
  fn: (InsertDirectPluginWidget) => InsertDirectPluginWidget,
}

export interface InsertPlugin {
  op: PluginOperations.INSERT,
  widget: PluginWidget,
}

export interface WrapPlugin {
  op: PluginOperations.WRAP,
  widgetId: string,
  wrapper: ElementType
}

export interface HidePlugin {
  op: PluginOperations.HIDE,
  widgetId: string
}

export type Plugin = HidePlugin | InsertPlugin | ModifyPlugin | WrapPlugin;

export type ProjectSiteConfig = RequiredSiteConfig & Partial<OptionalSiteConfig>;

export interface OptionalSiteConfig {

  pluginSlots: {
    [slotName: string]: {
      keepDefault: boolean,
      plugins: Array<Plugin>,
    },
  },

  // Cookies
  ACCESS_TOKEN_COOKIE_NAME: string,
  LANGUAGE_PREFERENCE_COOKIE_NAME: string,
  USER_INFO_COOKIE_NAME: string,

  // Paths
  CSRF_TOKEN_API_PATH: string,
  REFRESH_ACCESS_TOKEN_API_PATH: string,

  // Logging
  IGNORED_ERROR_REGEX: RegExp | null,

  // Analytics
  SEGMENT_KEY: string | null,

  ENVIRONMENT: EnvironmentTypes,
  MFE_CONFIG_API_URL: string | null,
  PUBLIC_PATH: string,

  // Backends
  CREDENTIALS_BASE_URL: string | null,
  DISCOVERY_API_BASE_URL: string | null,
  ECOMMERCE_BASE_URL: string | null,
  PUBLISHER_BASE_URL: string | null,

  // Frontends
  ORDER_HISTORY_URL: string | null,
  SUPPORT_URL: string | null,

  SUPPORT_EMAIL: string | null,
  TERMS_OF_SERVICE_URL: string | null,
  PRIVACY_POLICY_URL: string | null,
  ACCESSIBILITY_URL: string | null,

  custom: {
    [key: string]: any,
  }
}

export interface RequiredSiteConfig {
  apps: Array<AppConfig>,

  APP_ID: string,
  BASE_URL: string,
  SITE_NAME: string,

  // Frontends
  ACCOUNT_PROFILE_URL: string,
  ACCOUNT_SETTINGS_URL: string,
  LEARNER_DASHBOARD_URL: string,
  LEARNING_BASE_URL: string,
  LOGIN_URL: string,
  LOGOUT_URL: string,
  MARKETING_SITE_BASE_URL: string,

  // Backends
  LMS_BASE_URL: string,
  STUDIO_BASE_URL: string,

  // Branding
  FAVICON_URL: string,
  LOGO_TRADEMARK_URL: string,
  LOGO_URL: string,
  LOGO_WHITE_URL: string,
}

export type SiteConfig = RequiredSiteConfig & OptionalSiteConfig;

export interface ModuleConfig {
  modules?: Array<string>,
  name?: string,
  plugins?: any,
  custom?: {
    [key: string]: any,
  }
}

export interface User {
  administrator: boolean,
  email: string,
  name: string,
  roles: Array<string>,
  userId: number,
  username: string,
  avatar: string,
}

export enum HeaderTypes {
  DEFAULT = 'default',
  STUDIO = 'studio',
  LEARNING = 'learning',
  NONE = 'none',
}

export enum FooterTypes {
  DEFAULT = 'default',
  STUDIO = 'studio',
  NONE = 'none',
}

export enum EnvironmentTypes {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}
