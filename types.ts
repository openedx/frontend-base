import { FC, ReactElement, ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { RouteObject } from 'react-router';
import { SlotOperation } from './runtime/slots/types';
import { LoggingService } from './runtime/logging';
import { AnalyticsService } from './runtime/analytics';
import { AuthService } from './runtime/auth';

// Apps

export interface ExternalRoute {
  role: string;
  url: string;
}

export type RoleRouteObject = RouteObject & {
  handle?: {
    /**
     * Route roles identify the purpose(s) a route fulfills in the site.
     */
    roles?: string[];
  };
};

export type AppConfig = Record<string, unknown>;

export type AppProvider = FC<{ children?: ReactNode }>;

export interface App {
  appId: string;
  routes?: RoleRouteObject[];
  providers?: AppProvider[];
  slots?: SlotOperation[];
  externalScripts?: ExternalScriptLoaderClass[];
  defaultConfig?: AppConfig;
  config?: AppConfig;
  provides?: Record<string, unknown>;
}

// External Scripts

export interface ExternalScriptLoader {
  loadScript(): void;
}

export type ExternalScriptLoaderClass = new (data: { config: AppConfig }) => ExternalScriptLoader;

// Site Config

export interface RequiredSiteConfig {
  siteId: string;
  siteName: string;
  baseUrl: string;

  // Backends
  lmsBaseUrl: string;

  // Frontends
  loginUrl: string;
  logoutUrl: string;
}

export type LocalizedMessages = Record<string, Record<string, string>>;
export type SiteMessages = LocalizedMessages[];

export type LoggingServiceClass = new (options: {
  config: SiteConfig,
}) => LoggingService;

export type AnalyticsServiceClass = new (options: {
  config: SiteConfig,
  loggingService: LoggingService,
  httpClient: unknown,
}) => AnalyticsService;

export type AuthServiceClass = new (options: {
  config: SiteConfig,
  loggingService: LoggingService,
  middleware: unknown[],
}) => AuthService;

export interface OptionalSiteConfig {
  // Site environment
  environment: EnvironmentTypes;

  // Backends
  cmsBaseUrl: string;

  // Apps, routes, and URLs
  apps: App[];
  basename: string;
  externalRoutes: ExternalRoute[];
  externalLinkUrlOverrides: string[];
  runtimeConfigJsonUrl: string | null;
  commonAppConfig: AppConfig;
  headerLogoImageUrl: string;

  // Theme
  theme: Theme;

  // i18n
  defaultLanguage: string;
  supportedLanguages: string[];

  // Cookies
  accessTokenCookieName: string;
  languagePreferenceCookieName: string;
  userInfoCookieName: string;

  // Paths
  csrfTokenApiPath: string;
  refreshAccessTokenApiPath: string;

  // Logging
  ignoredErrorRegex: RegExp | null;

  // Analytics
  segmentKey: string | null,

  // Services
  loggingService: LoggingServiceClass,
  analyticsService: AnalyticsServiceClass,
  authService: AuthServiceClass,
}

export type SiteConfig = RequiredSiteConfig & Partial<OptionalSiteConfig>;

export interface ThemeVariant {
  url: string;
}

export interface ThemeDefaults {
  light?: string;
  dark?: string;
}

export type ThemeVariants = Record<string, ThemeVariant>;

export interface Theme {
  core?: ThemeVariant;
  defaults?: ThemeDefaults;
  variants?: ThemeVariants;
}

export interface User {
  administrator: boolean;
  email: string;
  name: string;
  roles: string[];
  userId: number;
  username: string;
  avatar?: string;
}

export enum EnvironmentTypes {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

// Menu Items

export type MenuItemName = string | MessageDescriptor | ReactElement;
