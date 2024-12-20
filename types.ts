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
  PREPEND = 'prepend',
  INSERT_AFTER = 'insertAfter',
  INSERT_BEFORE = 'insertBefore',
  REPLACE = 'replace',
  REMOVE = 'remove',
}

export type AbsoluteWidgetOperationTypes = WidgetOperationTypes.APPEND | WidgetOperationTypes.PREPEND;

export type RelativeWidgetOperationTypes = WidgetOperationTypes.INSERT_AFTER | WidgetOperationTypes.INSERT_BEFORE | WidgetOperationTypes.REPLACE;

export interface ComponentOperation extends BaseWidgetOperation {
  op: AbsoluteWidgetOperationTypes,
  component: React.ComponentType,
}

export interface RelativeComponentOperation extends BaseWidgetOperation {
  op: RelativeWidgetOperationTypes,
  component: React.ComponentType,
  relatedId: string,
}

export interface LayoutOptionsOperation extends BaseWidgetOperation {
  op: LayoutOperationTypes.OPTIONS,
  options?: Record<string, any>,
}

export interface ElementOperation extends BaseWidgetOperation {
  op: AbsoluteWidgetOperationTypes,
  element: ReactNode,
}

export interface RelativeElementOperation extends BaseWidgetOperation {
  op: RelativeWidgetOperationTypes,
  element: ReactNode,
  relatedId: string,
}

export interface IFrameOperation extends BaseWidgetOperation {
  op: AbsoluteWidgetOperationTypes,
  url: string,
  title: string,
}

export interface RelativeIFrameOperation extends BaseWidgetOperation {
  op: RelativeWidgetOperationTypes,
  url: string,
  title: string,
  relatedId: string,
}

export interface FederatedOperation extends BaseWidgetOperation {
  op: AbsoluteWidgetOperationTypes,
  remoteId: string,
  moduleId: string,
}

export interface RelativeFederatedOperation extends BaseWidgetOperation {
  op: RelativeWidgetOperationTypes,
  remoteId: string,
  moduleId: string,
  relatedId: string,
}

export interface RemoveOperation extends BaseWidgetOperation {
  op: WidgetOperationTypes.REMOVE,
  relatedId: string,
}

export interface ReplaceLayoutOperation extends BaseWidgetOperation {
  op: LayoutOperationTypes.LAYOUT,
  layout: React.ComponentType,
}

export type AbsoluteWidgetOperations = ComponentOperation | ElementOperation | IFrameOperation | FederatedOperation;

export type RelativeWidgetOperations = RelativeComponentOperation | RelativeElementOperation | RelativeIFrameOperation | RelativeFederatedOperation | RemoveOperation;

export type SlotOperations = LayoutOptionsOperation | ReplaceLayoutOperation;

export type WidgetOperation = AbsoluteWidgetOperations | RelativeWidgetOperations | SlotOperations;

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
  appId: string,
  siteName: string,
  baseUrl: string,
  environment: EnvironmentTypes,

  // Backends
  lmsBaseUrl: string,

  // Frontends
  loginUrl: string,
  logoutUrl: string,
}

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
  accessTokenCookieName: string,
  languagePreferenceCookieName: string,
  userInfoCookieName: string,

  // Paths
  csrfTokenApiPath: string,
  refreshAccessTokenApiPath: string,

  // Logging
  ignoredErrorRegex: RegExp | null,

  // Analytics
  segmentKey: string | null,

  environment: EnvironmentTypes,
  mfeConfigApiUrl: string | null,
  publicPath: string,

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
