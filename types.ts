import { FC, ReactElement, ReactNode } from 'react';
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
     * A route role is used to identify a route that fulfills a particular role in the site.
     */
    role?: string,
  },
};

export type AppConfig = Record<string, unknown>;

export type AppProvider = FC<{ children?: ReactNode }>;

export interface App {
  appId: string,
  messages?: LocalizedMessages,
  routes?: RoleRouteObject[],
  providers?: AppProvider[],
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
  runtimeConfigJsonUrl: string | null,

  // Theme
  theme: Theme,

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

export interface ThemeVariant {
  url: string,
}

export interface ThemeDefaults {
  light?: string,
  dark?: string,
}

export type ThemeVariants = Record<string, ThemeVariant>;

export interface Theme {
  core?: ThemeVariant,
  defaults?: ThemeDefaults,
  variants?: ThemeVariants,
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
