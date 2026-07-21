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
     * Route roles identify the purpose(s) a route fulfills in the site.
     */
    roles?: string[],
  },
};

export type AppConfig = Record<string, unknown>;

export type AppProvider = FC<{ children?: ReactNode }>;

export interface App {
  appId: string,
  routes?: RoleRouteObject[],
  providers?: AppProvider[],
  slots?: SlotOperation[],
  externalScripts?: ExternalScriptLoaderClass[],
  config?: AppConfig,
  provides?: Record<string, unknown>,
}

// External Scripts

export interface ExternalScriptLoader {
  loadScript(): void,
}

export type ExternalScriptLoaderClass = new (data: { config: AppConfig }) => ExternalScriptLoader;

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
export type SiteMessages = LocalizedMessages[];

// Generic logger contract
export interface LoggingService {
  debug?(message: string, meta?: Record<string, unknown>): void,
  info?(message: string, meta?: Record<string, unknown>): void,
  warn?(message: string, meta?: Record<string, unknown>): void,
  error?(message: string | Error, meta?: Record<string, unknown>): void,
}

// Generic analytics contract
export interface AnalyticsService {
  identify?(userId: string | number, traits?: Record<string, unknown>): void,
  track(event: string, properties?: Record<string, unknown>): void,
  page?(name?: string, properties?: Record<string, unknown>): void,
  reset?(): void,
}

// Generic auth contract
export interface AuthService {
  isAuthenticated(): boolean | Promise<boolean>,
  getAccessToken?(): string | null | Promise<string | null>,
  login?(redirectUrl?: string): void | Promise<void>,
  logout?(redirectUrl?: string): void | Promise<void>,
  getCurrentUser?(): User | null | Promise<User | null>,
}

export interface OptionalSiteConfig {
  // Site environment
  environment: EnvironmentTypes,

  // Backends
  cmsBaseUrl: string,

  // Apps, routes, and URLs
  apps: App[],
  basename: string,
  externalRoutes: ExternalRoute[],
  externalLinkUrlOverrides: string[],
  runtimeConfigJsonUrl: string | null,
  commonAppConfig: AppConfig,
  headerLogoImageUrl: string,

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

  // Services
  loggingService: LoggingService,
  analyticsService: AnalyticsService,
  authService: AuthService,
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
