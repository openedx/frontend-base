import { ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';
import { RouteObject } from 'react-router';
import { SlotOperation } from './runtime/slots/types';

// Apps

export interface ExternalRoute {
  role: string,
  url: string,
}

export type RoleRouteObject = RouteObject & {
  handle?: {
    /**
     * A route role is used to identify a route that fulfills a particular role in the site, such as "login", "learnerHome", or "profile".
     */
    role?: string,
  },
};

export interface App {
  messages?: LocalizedMessages,
  routes?: RoleRouteObject[],
  slots?: SlotOperation[],
  config?: AppConfig,
}

export type AppConfig = {
  // An AppConfig must contain an appId if it exists, which allows us to differentiate between app configs.
  appId,
} & Record<string, unknown>;

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

  custom: AppConfig,
}

export type SiteConfig = RequiredSiteConfig & OptionalSiteConfig;

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
