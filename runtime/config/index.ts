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

import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import merge from 'lodash/merge';
import {
  App,
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

interface MergeSiteConfigOptions {
  limitAppMergeToConfig?: boolean,
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
 * Apps are merged by appId rather than array index. By default, apps in the incoming config
 * that don't exist in the current config will be added.
 *
 * When `limitAppMergeToConfig` is true:
 * - All non-app parts of the config are still merged normally
 * - Only the `config` property of each existing app is merged
 * - Apps in the incoming config that don't exist in the current config are ignored
 *
 * @param {Object} newSiteConfig
 * @param {Object} options
 * @param {boolean} options.limitAppMergeToConfig - Limit app merging to only the config property of existing apps
 */
export function mergeSiteConfig(
  newSiteConfig: Partial<SiteConfig>,
  options: MergeSiteConfigOptions = {}
) {
  const { limitAppMergeToConfig = false } = options;
  const { apps: newApps, ...restOfNewConfig } = newSiteConfig;

  /* `merge({}, ...)` deep-clones into the fresh target, so the new `siteConfig`
     is a brand-new reference and the previous one is never mutated. This is what
     lets React consumers detect that CONFIG_CHANGED actually changed something. */
  siteConfig = merge({}, siteConfig, restOfNewConfig);

  // if we don't have new apps, we're done
  if (!newApps?.length) {
    publish(CONFIG_CHANGED);
    return;
  }

  // if we're doing a full merge, merge the objects
  if (!limitAppMergeToConfig) {
    siteConfig.apps = mergeApps(siteConfig.apps || [], newApps);
    publish(CONFIG_CHANGED);
    return;
  }

  // we're doing a config-only merge, if we don't
  // have apps already, we can't update their configs
  if (!siteConfig.apps?.length) {
    publish(CONFIG_CHANGED);
    return;
  }

  // handle config-only merging
  siteConfig.apps = mergeApps(siteConfig.apps, newApps, { configOnly: true });

  publish(CONFIG_CHANGED);
}

/*
 * Merge two App[] by appId. Existing apps stay in their original positions
 * (with their pair-merged counterpart from `newApps` substituted in when
 * present); apps in `newApps` not already in `oldApps` append at the end.
 * With `{ configOnly: true }`, no apps are added and apps not appearing in
 * `newApps` pass through unchanged. Per-pair merging is delegated to
 * `mergeApp`.
 */
function mergeApps(
  oldApps: App[],
  newApps: App[],
  options: { configOnly?: boolean } = {},
): App[] {
  const incomingByAppId = keyBy(newApps, 'appId');

  // Phase 1: walk existing apps in their original order, pair-merging any
  // that have a counterpart in newApps.
  const updatedExisting = oldApps.map((oldApp) => {
    const newApp = incomingByAppId[oldApp.appId];
    return newApp ? mergeApp(oldApp, newApp, options) : oldApp;
  });

  // configOnly mode never adds apps, so we're done.
  if (options.configOnly) {
    return updatedExisting;
  }

  // Phase 2: append apps from newApps that weren't already in oldApps.
  const existingIds = new Set(oldApps.map((a) => a.appId));
  const additions = newApps.filter((a) => !existingIds.has(a.appId));
  return [...updatedExisting, ...additions];
}

/*
 * Merge a pair of Apps with the same appId. Deep-merges `config` (and, in the
 * full-merge case, `provides`); other fields take `newApp`'s value verbatim.
 * The result is built via `Object.getOwnPropertyDescriptors` so any lazy
 * getters survive: a snapshot via `lodash.merge` or spread would invoke the
 * getter at merge time and freeze its return value, which is typically empty
 * mid-init. Per-field replacement is also the only sensible behavior for the
 * array fields (`slots`/`routes`/`providers`/`externalScripts`), which don't
 * survive element-wise merging anyway.
 */
function mergeApp(
  oldApp: App,
  newApp: App,
  options: { configOnly?: boolean } = {},
): App {
  // configOnly mode: preserve `oldApp` (identity, slots, etc.) and deep-merge
  // only `newApp.config` on top.
  if (options.configOnly) {
    if (!newApp.config) {
      return oldApp;
    }
    return cloneAppDescriptors(oldApp, {
      config: merge({}, oldApp.config, newApp.config),
    });
  }

  // Full mode: take `newApp` (identity, slots, etc.) and deep-merge `config`
  // and `provides` from `oldApp`. Other fields take `newApp`'s value verbatim.
  const deepMerged: Record<string, unknown> = {};
  if (oldApp.config !== undefined || newApp.config !== undefined) {
    deepMerged.config = merge({}, oldApp.config, newApp.config);
  }
  if (oldApp.provides !== undefined || newApp.provides !== undefined) {
    deepMerged.provides = merge({}, oldApp.provides, newApp.provides);
  }
  return cloneAppDescriptors(newApp, deepMerged);
}

function cloneAppDescriptors(source: App, overrides: Record<string, unknown>): App {
  const descriptors = Object.getOwnPropertyDescriptors(source);
  for (const [key, value] of Object.entries(overrides)) {
    descriptors[key] = { value, writable: true, enumerable: true, configurable: true };
  }
  return Object.create(Object.getPrototypeOf(source), descriptors) as App;
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
  const { commonAppConfig } = getSiteConfig();
  if (commonAppConfig === undefined) {
    return appConfigs[id];
  }
  return merge({}, commonAppConfig, appConfigs[id]);
}

export function mergeAppConfig(id: string, newAppConfig: AppConfig) {
  // Non-mutating: produce a fresh entry so consumers holding a reference to
  // the previous one don't observe the change underneath them.
  appConfigs[id] = merge({}, appConfigs[id], newAppConfig);
  publish(CONFIG_CHANGED);
}

let activeRouteRoles: string[] = [];

export function setActiveRouteRoles(roles: string[]) {
  if (isEqual(activeRouteRoles, roles)) return;
  activeRouteRoles = roles;
  publish(ACTIVE_ROLES_CHANGED);
}

export function getActiveRouteRoles() {
  return activeRouteRoles;
}

const activeWidgetRoles: Record<string, number> = {};

export function addActiveWidgetRole(role: string) {
  // Only publish when the role transitions from absent to present.
  const wasPresent = (activeWidgetRoles[role] ?? 0) > 0;
  activeWidgetRoles[role] = (activeWidgetRoles[role] ?? 0) + 1;
  if (!wasPresent) publish(ACTIVE_ROLES_CHANGED);
}

export function removeActiveWidgetRole(role: string) {
  if (activeWidgetRoles[role] === undefined) return;
  activeWidgetRoles[role] -= 1;
  if (activeWidgetRoles[role] < 1) {
    delete activeWidgetRoles[role];
    // Only publish when the role transitions from present to absent.
    publish(ACTIVE_ROLES_CHANGED);
  }
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
 * Collects all `provides` entries from registered apps that match the given identifier.
 * This enables inter-app data sharing without frontend-base needing to understand the data shape.
 *
 * @param id - The namespaced provides identifier.
 * @returns An array of provided data from all apps that declared data for this identifier.
 */
export function getProvides(id: string): unknown[] {
  const { apps } = getSiteConfig();
  if (!apps) return [];

  const results: unknown[] = [];
  for (const app of apps) {
    if (app.provides && app.provides[id] !== undefined) {
      results.push(app.provides[id]);
    }
  }
  return results;
}

/**
 * Collects and flattens all `provides` entries for the given identifier
 * as strings.  Each entry can be a single string or a string array; entries
 * of other types are silently skipped.
 *
 * @param id - The namespaced provides identifier.
 * @returns A flat array of strings from all apps that declared data for this identifier.
 */
export function getProvidesAsStrings(id: string): string[] {
  return getProvides(id)
    .filter((data): data is string | string[] => typeof data === 'string' || Array.isArray(data))
    .flat();
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
