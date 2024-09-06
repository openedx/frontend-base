import { ElementType } from 'react';

export interface ExternalAppConfig {
  appId: string,
  url: string,
}

export interface InternalAppConfig {
  appId: string,
  component: ElementType,
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

export interface SiteConfig {
  apps: Array<ExternalAppConfig | InternalAppConfig | FederatedAppConfig>,

  pluginSlots?: {
    [slotName: string]: {
      keepDefault: boolean,
      plugins: Array<Plugin>,
    },
  },

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
