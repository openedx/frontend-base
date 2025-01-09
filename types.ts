import { ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';
import { RouteObject } from 'react-router';
import { SlotOperation } from './runtime/slots/types';

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

  // Backends
  lmsBaseUrl: string,

  // Frontends
  loginUrl: string,
  logoutUrl: string,
}

export type LocalizedMessages = Record<string, Record<string, string>>;

export type ProjectSiteConfig = RequiredSiteConfig & Partial<OptionalSiteConfig>;

export interface OptionalSiteConfig {
  apps: App[],
  federatedApps: FederatedApp[],
  remotes: Remote[],
  externalRoutes: ExternalRoute[],

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
}

export type SiteConfig = RequiredSiteConfig & OptionalSiteConfig;

export interface ProjectModuleConfig {
  modules?: string[],
  name?: string,
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

// Learning

// TODO: Make this interface match the shape of course info coming back from the server.
// Check what additional data frontend-app-learning or frontend-app-authoring has and model it here.
export interface CourseInfo {
  title: string,
  number: string,
  org: string,
}
