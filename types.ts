import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { RouteObject } from 'react-router';

// Slots

export interface SlotCondition {
  active?: string,
  inactive?: string,
  authenticated?: boolean,
}

// Slot operations

export enum LayoutOperationTypes {
  OPTIONS = 'options',
  LAYOUT = 'layout',
}

// Widget slot operations

export interface BaseWidgetOperation {
  slotId: `${string}.widget`,
  id: string,
  role?: string,
  condition?: SlotCondition,
}

export enum WidgetOperationTypes {
  APPEND = 'append',
}

export interface ComponentOperation extends BaseWidgetOperation {
  op: WidgetOperationTypes,
  component: React.ComponentType,

}

export interface OptionsOperation extends BaseWidgetOperation {
  op: LayoutOperationTypes.OPTIONS,
  options?: Record<string, any>,
}

export interface ElementOperation extends BaseWidgetOperation {
  op: WidgetOperationTypes,
  element: ReactNode,
}

export interface IFrameOperation extends BaseWidgetOperation {
  op: WidgetOperationTypes,
  url: string,
  title: string,
}

export interface FederatedOperation extends BaseWidgetOperation {
  op: WidgetOperationTypes,
  remoteId: string,
  moduleId: string,
}

export interface LayoutOperation extends BaseWidgetOperation {
  op: LayoutOperationTypes.LAYOUT,
  layout: React.ComponentType,
}

export type WidgetOperation = ComponentOperation | OptionsOperation | ElementOperation | IFrameOperation | FederatedOperation | LayoutOperation;

// Slot operation

export type SlotOperation = WidgetOperation;

// Apps

export interface ExternalRoute {
  role: string,
  url: string,
}

export interface App {
  messages?: LocalizedMessages,
  routes?: RouteObject[],
  slots?: SlotOperation[],
  remotes?: Remote[],
}

export interface FederatedApp {
  remoteId: string,
  moduleId: string,
  // rolePaths are used to find out the paths to certain roles before loading the app via module federation.  This means we can form links without needing to load the whole thing.
  rolePaths?: Record<string, string>,
  hints?: {
    // The path hints are used by our react-router patchRoutesOnNavigation handler to load the
    // federated app when one of its paths has been requested.  This can happen, for instance, when
    // a path is loaded via the rolePaths above.
    paths?: string[],
  },
}

export interface Remote {
  id: string,
  url: string,
}

// Site Config

export interface RequiredSiteConfig {
  APP_ID: string,
  SITE_NAME: string,
  BASE_URL: string,
  ENVIRONMENT: EnvironmentTypes,

  // Backends
  LMS_BASE_URL: string,

  // Branding
  FAVICON_URL: string,
  LOGO_TRADEMARK_URL: string,
  LOGO_URL: string,
  LOGO_WHITE_URL: string,

  // Frontends
  LOGIN_URL: string,
  LOGOUT_URL: string,
}

/*

BOOOYAHHHH
BOOOYAHHHH
BOOOYAHHHH
BOOOYAHHHH
BOOOYAHHHH
BOOOYAHHHH
BOOOYAHHHH
BOOOYAHHHH
BOOOYAHHHH
BOOOYAHHHH

*/

export type LocalizedMessages = Record<string, Record<string, string>>;

export type ProjectSiteConfig = RequiredSiteConfig & Partial<OptionalSiteConfig>;

export interface PluginSlotConfig {
  keepDefault: boolean,
  plugins: PluginChange[],
}

export interface OptionalSiteConfig {
  apps: App[],
  federatedApps: FederatedApp[],
  remotes: Remote[],
  externalRoutes: ExternalRoute[],

  pluginSlots: Record<string, PluginSlotConfig>,

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
  SUPPORT_URL: string | null,

  SUPPORT_EMAIL: string | null,
  TERMS_OF_SERVICE_URL: string | null,
  PRIVACY_POLICY_URL: string | null,
  ACCESSIBILITY_URL: string | null,

  custom: Record<string, any>,
}

export type SiteConfig = RequiredSiteConfig & OptionalSiteConfig;

export interface ProjectModuleConfig {
  modules?: string[],
  name?: string,
  plugins?: any,
  custom?: Record<string, any>,
}

export interface User {
  administrator: boolean,
  email: string,
  name: string,
  roles: string[],
  userId: number,
  username: string,
  avatar: string,
}

export enum EnvironmentTypes {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

// Menu Items

export type MenuItemName = string | MessageDescriptor | ReactElement;

// Plugin Types

/**
 * Defines the changes to be made to either the default widget(s) or to any
 * that are inserted.
 */
export enum PluginOperationTypes {
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

export interface BasePluginContainerConfig {
  id: string,
  type: PluginTypes,
  priority: number,
  hidden?: boolean,
  wrappers?: FunctionComponent[],
}

export interface PluginContainerIframeConfig extends BasePluginContainerConfig {
  url: string,
  title: string,
}

export interface PluginContainerDirectConfig extends BasePluginContainerConfig {
  RenderWidget: FunctionComponent<Record<string, any>>,
  content?: Record<string, any>,
}

export type PluginContainerConfig = PluginContainerIframeConfig | PluginContainerDirectConfig | DefaultContentsPluginContainerConfig;

export interface DefaultContentsPluginContainerConfig extends Omit<PluginContainerDirectConfig, 'RenderWidget'> {
  RenderWidget: ReactNode,
}

export interface MessageEventCallbackParams {
  type: string,
  payload: any,
}

export type MessageEventCallback = ({ type, payload }: MessageEventCallbackParams) => void;
;

export interface ModifyPlugin {
  op: PluginOperationTypes.MODIFY,
  widgetId: string,
  fn: (widget: PluginContainerConfig) => PluginContainerConfig,
}

export interface InsertPlugin {
  op: PluginOperationTypes.INSERT,
  widget: PluginContainerIframeConfig | PluginContainerDirectConfig,
}

export interface WrapPlugin {
  op: PluginOperationTypes.WRAP,
  widgetId: string,
  wrapper: FunctionComponent<{ component: ReactNode }>,
}

export interface HidePlugin {
  op: PluginOperationTypes.HIDE,
  widgetId: string,
}

export type PluginChange = HidePlugin | InsertPlugin | ModifyPlugin | WrapPlugin;

// Learning

// TODO: Make this interface match the shape of course info coming back from the server.
// Check what additional data frontend-app-learning or frontend-app-authoring has and model it here.
export interface CourseInfo {
  title: string,
  number: string,
  org: string,
}
