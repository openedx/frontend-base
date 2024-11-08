import { ElementType, ReactElement, ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { IndexRouteObject, NonIndexRouteObject } from 'react-router';

export type AppConfig = ExternalAppConfig | InternalAppConfig | FederatedAppConfig | HydratedFederatedAppConfig;

export type ConfigurableAppConfig = InternalAppConfig | HydratedFederatedAppConfig;

export enum AppConfigTypes {
  EXTERNAL = 'external',
  INTERNAL = 'internal',
  FEDERATED = 'federated',
}

export interface AppModuleHandle {
  appId: string,
  [key: string]: any,
}

// We extend the react-router RouteObject to make path required. `path` is not required for
// 'layout' routes, which for now we won't support as the route of a module.
// Documentation of this here: https://reactrouter.com/en/main/route/route#layout-routes
export interface AppModuleIndexRouteObject extends IndexRouteObject {
  path: string,
}

export interface AppModuleNonIndexRouteObject extends NonIndexRouteObject {
  path: string,
}

export type AppModuleRouteObject = AppModuleIndexRouteObject | AppModuleNonIndexRouteObject;

export type LocalizedMessages = Record<string, Record<string, string>>;

export interface ApplicationModuleConfig {
  route: AppModuleRouteObject,
  header?: HeaderConfig,
  footer?: FooterConfig,
  messages?: LocalizedMessages,
}

export interface InternalAppConfig {
  id: string,
  type: AppConfigTypes.INTERNAL,
  config: ApplicationModuleConfig,
  path?: string,
}

export interface FederationConfig {
  libraryId: string,
  moduleId: string,
  remoteUrl: string,
}

export interface FederatedAppConfig {
  id: string,
  type: AppConfigTypes.FEDERATED,
  federation: FederationConfig,
  path: string,
}

export interface HydratedFederatedAppConfig extends FederatedAppConfig {
  config: ApplicationModuleConfig,
}

export interface ExternalAppConfig {
  id: string,
  type: AppConfigTypes.EXTERNAL,
  url: string,
}

export type ProjectSiteConfig = RequiredSiteConfig & Partial<OptionalSiteConfig>;

export interface OptionalSiteConfig {

  pluginSlots: Record<string, {
    keepDefault: boolean,
    plugins: Plugin[],
  }>,

  header?: HeaderConfig,
  footer?: FooterConfig,

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

  custom: Record<string, any>,
}

export interface RequiredSiteConfig {
  apps: AppConfig[],

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

export interface AppMenuItemConfig {
  id: string,
  label: MenuItemName,
  appId: string,
}

export interface DropdownMenuItemConfig {
  id: string,
  label: MessageDescriptor | string,
  items: ChildMenuItemConfig[],
}

export interface UrlMenuItemConfig {
  id: string,
  label: MenuItemName,
  url: string,
}

export interface ComponentMenuItemConfig {
  id: string,
  component: ReactElement,
}

export interface LabeledMenuConfig {
  id: string,
  label: MenuItemName,
  links: MenuItemConfig[],
}

export type LinkMenuItemConfig = AppMenuItemConfig | UrlMenuItemConfig;

export type ChildMenuItemConfig = LinkMenuItemConfig | ComponentMenuItemConfig;

export type MenuItemConfig = DropdownMenuItemConfig | ChildMenuItemConfig;

// Header

export interface HeaderConfig {
  logoUrl?: string,
  logoDestinationUrl?: string | null,
  primaryLinks?: MenuItemConfig[],
  secondaryLinks?: MenuItemConfig[],
  anonymousLinks?: MenuItemConfig[],
  authenticatedLinks?: ChildMenuItemConfig[],
}

export interface ResolvedHeaderConfig {
  logoUrl: string,
  logoDestinationUrl: string | null,
  primaryLinks: MenuItemConfig[],
  secondaryLinks: MenuItemConfig[],
  anonymousLinks: MenuItemConfig[],
  authenticatedLinks: ChildMenuItemConfig[],
}

// Footer

export interface FooterConfig {
  logoUrl?: string,
  logoDestinationUrl?: string | null,
  leftLinks?: ChildMenuItemConfig[],
  centerLinks?: LabeledMenuConfig[],
  rightLinks?: ChildMenuItemConfig[],
  revealMenu?: LabeledMenuConfig,
  copyrightNotice?: ReactNode,
}

export interface ResolvedFooterConfig {
  logoUrl: string,
  logoDestinationUrl: string | null,
  leftLinks: ChildMenuItemConfig[],
  centerLinks: LabeledMenuConfig[],
  rightLinks: ChildMenuItemConfig[],
  revealMenu?: LabeledMenuConfig, // this can be undefined
  copyrightNotice?: ReactNode, // this can be undefined
}

// Plugin Types

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
  content?: Record<string, any>,
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
  wrapper: ElementType,
}

export interface HidePlugin {
  op: PluginOperations.HIDE,
  widgetId: string,
}

export type Plugin = HidePlugin | InsertPlugin | ModifyPlugin | WrapPlugin;

// Learning

// TODO: Make this interface match the shape of course info coming back from the server.
// Check what additional data frontend-app-learning or frontend-app-authoring has and model it here.
export interface CourseInfo {
  title: string,
  number: string,
  org: string,
}
