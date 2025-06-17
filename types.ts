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

export type AppConfig = Record<string, unknown>;

export interface App {
  appId: string,
  messages?: LocalizedMessages,
  routes?: RoleRouteObject[],
  slots?: SlotOperation[],
  config?: AppConfig,
}

// Site Config

export interface RequiredSiteConfig {
  siteId: string,
  siteName: string,
  baseUrl: string,

  // Backends
  lmsBaseUrl: string,

  // Frontends
  loginUrl: string,
  logoutUrl: string,
}

export type LocalizedMessages = Record<string, Record<string, string>>;

export interface OptionalSiteConfig {
  // Site environment
  environment: EnvironmentTypes,

  // Apps, routes, and URLs
  apps: App[],
  basename: string,
  externalRoutes: ExternalRoute[],
  externalLinkUrlOverrides: string[],
  mfeConfigApiUrl: string | null,

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
}

export type SiteConfig = RequiredSiteConfig & Partial<OptionalSiteConfig>;

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
