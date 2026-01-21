/**
 * #### Import members from **@edx/frontend-base**
 *
 * The configuration module provides utilities for working with an application's configuration
 * document (SiteConfig).  Configuration variables can be supplied to the
 * application in three different ways.  They are applied in the following order:
 *
 * - Site Configuration File (site.config.tsx)
 * - Initialization Config Handler
 * - Runtime Configuration
 *
 * Last one in wins, and are deep merged together.  Variables with the same name defined via the
 * later methods will override any defined using an earlier method.  i.e., if a variable is defined
 * in Runtime Configuration, that will override the same variable defined in either of the earlier
 * methods.  Configuration defined in a JS file will override any default values below.
 *
 * ##### Site Configuration File
 *
 * Configuration variables can be supplied in a file named site.config.tsx.  This file must
 * export either an Object containing configuration variables or a function.  The function must
 * return an Object containing configuration variables or, alternately, a promise which resolves to
 * an Object.
 *
 * Using a function or async function allows the configuration to be resolved at runtime (because
 * the function will be executed at runtime).  This is not common, and the capability is included
 * for the sake of flexibility.
 *
 * The Site Configuration File is well-suited to extensibility use cases or component overrides,
 * in that the configuration file can depend on any installed JavaScript module.  It is also the
 * preferred way of doing build-time configuration if runtime configuration isn't used by your
 * deployment of the platform.
 *
 * Exporting a config object:
 * ```
 * const siteConfig = {
 *   lmsBaseUrl: 'http://localhost:18000'
 * };
 *
 * export default siteConfig;
 * ```
 *
 * Exporting a function that returns an object:
 * ```
 * function getSiteConfig() {
 *   return {
 *     lmsBaseUrl: 'http://localhost:18000'
 *   };
 * }
 * ```
 *
 * Exporting a function that returns a promise that resolves to an object:
 * ```
 * function getAsyncSiteConfig() {
 *   return new Promise((resolve, reject) => {
 *     resolve({
 *       lmsBaseUrl: 'http://localhost:18000'
 *     });
 *   });
 * }
 *
 * export default getAsyncSiteConfig;
 * ```
 *
 * ##### Initialization Config Handler
 *
 * The configuration document can be extended by
 * applications at run-time using a `config` initialization handler.  Please see the Initialization
 * documentation for more information on handlers and initialization phases.
 *
 * ```
 * initialize({
 *   handlers: {
 *     config: () => {
 *       mergeSiteConfig({
 *         CUSTOM_VARIABLE: 'custom value',
 *         lmsBaseUrl: 'http://localhost:18001' // You can override variables, but this is uncommon.
  *       }, 'App config override handler');
 *     },
 *   },
 * });
 * ```
 *
 * ##### Runtime Configuration
 *
 * Configuration variables can also be supplied using the "runtime configuration" method, taking
 * advantage of the Micro-frontend Config API in edx-platform. More information on this API can be
 * found in the ADR which introduced it:
 *
 * https://github.com/openedx/edx-platform/blob/master/lms/djangoapps/mfe_config_api/docs/decisions/0001-mfe-config-api.rst
 *
 * The runtime configuration method can be enabled by supplying a runtimeConfigJsonUrl via one of the other
 * two configuration methods above.
 *
 * Runtime configuration is particularly useful if you need to supply different configurations to
 * a single deployment of a micro-frontend, for instance.  It is also a perfectly valid alternative
 * to build-time configuration, though it introduces an additional API call to edx-platform on MFE
 * initialization.
 *
 *
 * @module Config
 */

import merge from 'lodash.merge';
import {
  AppConfig,
  EnvironmentTypes,
  SiteConfig
} from '../../types';
import { ACTIVE_ROLES_CHANGED, CONFIG_CHANGED } from '../constants';
import { publish } from '../subscriptions';

let siteConfig: SiteConfig = {
  // Required
  siteId: '',
  baseUrl: '',
  siteName: '',
  loginUrl: '',
  logoutUrl: '',
  lmsBaseUrl: '',

  // Optional
  environment: EnvironmentTypes.PRODUCTION,
  apps: [],
  externalRoutes: [],
  externalLinkUrlOverrides: [],
  runtimeConfigJsonUrl: null,
  theme: {},
  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
  csrfTokenApiPath: '/csrf/api/v1/token',
  ignoredErrorRegex: null,
  languagePreferenceCookieName: 'openedx-language-preference',
  refreshAccessTokenApiPath: '/login_refresh',
  userInfoCookieName: 'edx-user-info',
  segmentKey: null,
};

/**
 * Getter for the application configuration document.  This is synchronous and merely returns a
 * reference to an existing object, and is thus safe to call as often as desired.
 *
 * Example:
 *
 * ```
 * import { getSiteConfig } from '@openedx/frontend-base';
 *
 * const {
 *   lmsBaseUrl,
 * } = getSiteConfig();
 * ```
 *
 * @returns {SiteConfig}
  */
export function getSiteConfig() {
  return siteConfig;
}

/**
 * Replaces the existing SiteConfig.  This is not commonly used, but can be helpful for tests.
 *
 * Example:
 *
 * ```
 * import { setSiteConfig } from '@openedx/frontend-base';
 *
 * setSiteConfig({
 *   lmsBaseUrl, // This is overriding the ENTIRE document - this is not merged in!
 * });
 * ```
 *
 * @param newConfig A replacement SiteConfig which will completely override the current SiteConfig.
 */
export function setSiteConfig(newSiteConfig: SiteConfig) {
  siteConfig = newSiteConfig;
  publish(CONFIG_CHANGED);
}

/**
 * Merges additional configuration values into the site config returned by `getSiteConfig`.  Will
 * override any values that exist with the same keys.
 *
 * ```
 * mergeSiteConfig({
 *   NEW_KEY: 'new value',
 *   OTHER_NEW_KEY: 'other new value',
 * });
 *
 * This function uses lodash.merge internally to merge configuration objects
 * which means they will be merged recursively.  See https://lodash.com/docs/latest#merge for
 * documentation on the exact behavior.
 *
 * @param {Object} newSiteConfig
 */
export function mergeSiteConfig(newSiteConfig: Partial<SiteConfig>) {
  siteConfig = merge(siteConfig, newSiteConfig);
  publish(CONFIG_CHANGED);
}

const appConfigs: Record<string, AppConfig> = {};

/**
 * addAppConfigs finds any AppConfig objects in the apps in SiteConfig and makes their config
 * available to be used by Apps via getAppConfig(appId) or useAppConfig() functions.  This is
 * used at initialization time to process any AppConfigs bundled with the site.
 */
export function addAppConfigs() {
  const { apps } = getSiteConfig();
  if (!apps) return;

  for (const app of apps) {
    const { appId, config } = app;
    if (config !== undefined) {
      appConfigs[appId] = config;
    }
  }

  publish(CONFIG_CHANGED);
}

export function getAppConfig(id: string) {
  return appConfigs[id];
}

export function mergeAppConfig(id: string, newAppConfig: AppConfig) {
  appConfigs[id] = merge(appConfigs[id], newAppConfig);
  publish(CONFIG_CHANGED);
}

let activeRouteRoles: string[] = [];

export function setActiveRouteRoles(roles: string[]) {
  activeRouteRoles = roles;
  publish(ACTIVE_ROLES_CHANGED);
}

export function getActiveRouteRoles() {
  return activeRouteRoles;
}

const activeWidgetRoles: Record<string, number> = {};

export function addActiveWidgetRole(role: string) {
  activeWidgetRoles[role] ??= 0;
  activeWidgetRoles[role] += 1;
  publish(ACTIVE_ROLES_CHANGED);
}

export function removeActiveWidgetRole(role: string) {
  if (activeWidgetRoles[role] !== undefined) {
    activeWidgetRoles[role] -= 1;
  }
  if (activeWidgetRoles[role] < 1) {
    delete activeWidgetRoles[role];
  }
  publish(ACTIVE_ROLES_CHANGED);
}

export function getActiveWidgetRoles() {
  return Object.entries(activeWidgetRoles)
    .filter(([, count]: [role: string, count: number]) => count !== undefined && count > 0)
    .map(([role]: [role: string, count: number]) => role);
}

// Gets all active roles from the route roles and widget roles.
export function getActiveRoles() {
  return [...getActiveRouteRoles(), ...getActiveWidgetRoles()];
}

/**
 * Get an external link URL based on the URL provided. If the passed in URL is overridden in the
 * `externalLinkUrlOverrides` object, it will return the overridden URL. Otherwise, it will return
 * the provided URL.
 *
 *
 * @param {string} url - The default URL.
 * @returns {string} - The external link URL. Defaults to the input URL if not found in the
 * `externalLinkUrlOverrides` object. If the input URL is invalid, '#' is returned.
 *
 * @example
 * import { getExternalLinkUrl } from '@openedx/frontend-base';
 *
 * <Hyperlink
 *   destination={getExternalLinkUrl(data.helpLink)}
 *   target="_blank"
 * >
 */
export function getExternalLinkUrl(url: string): string {
  // Guard against whitespace-only strings
  if (typeof url !== 'string' || !url.trim()) {
    return '#';
  }

  const overriddenLinkUrls = getSiteConfig().externalLinkUrlOverrides ?? {};
  return overriddenLinkUrls[url] ?? url;
}
