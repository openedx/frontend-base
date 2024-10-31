/**
 * #### Import members from **@edx/frontend-base**
 *
 * The configuration module provides utilities for working with an application's configuration
 * document (ConfigDocument).  Configuration variables can be supplied to the
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
 * const config = {
 *   LMS_BASE_URL: 'http://localhost:18000'
 * };
 *
 * export default config;
 * ```
 *
 * Exporting a function that returns an object:
 * ```
 * function getConfig() {
 *   return {
 *     LMS_BASE_URL: 'http://localhost:18000'
 *   };
 * }
 * ```
 *
 * Exporting a function that returns a promise that resolves to an object:
 * ```
 * function getAsyncConfig() {
 *   return new Promise((resolve, reject) => {
 *     resolve({
 *       LMS_BASE_URL: 'http://localhost:18000'
 *     });
 *   });
 * }
 *
 * export default getAsyncConfig;
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
 *       mergeConfig({
 *         CUSTOM_VARIABLE: 'custom value',
 *         LMS_BASE_URL: 'http://localhost:18001' // You can override variables, but this is uncommon.
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
 * The runtime configuration method can be enabled by supplying a MFE_CONFIG_API_URL via one of the other
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
  AppConfigTypes, ApplicationModuleConfig, ConfigurableAppConfig, EnvironmentTypes, SiteConfig
} from '../types';
import { CONFIG_CHANGED } from './constants';
import { publish } from './subscriptions';

let config: SiteConfig = {
  ACCESS_TOKEN_COOKIE_NAME: 'edx-jwt-cookie-header-payload',
  CSRF_TOKEN_API_PATH: '/csrf/api/v1/token',
  ENVIRONMENT: EnvironmentTypes.PRODUCTION,
  IGNORED_ERROR_REGEX: null,
  LANGUAGE_PREFERENCE_COOKIE_NAME: 'openedx-language-preference',
  PUBLIC_PATH: '/',
  REFRESH_ACCESS_TOKEN_API_PATH: '/login_refresh',
  USER_INFO_COOKIE_NAME: 'edx-user-info',
  MFE_CONFIG_API_URL: null,

  SEGMENT_KEY: null,
  SUPPORT_EMAIL: null,

  // Optional Frontends
  ORDER_HISTORY_URL: null,
  SUPPORT_URL: null,
  TERMS_OF_SERVICE_URL: null,
  PRIVACY_POLICY_URL: null,
  ACCESSIBILITY_URL: null,

  // Optional Backends
  CREDENTIALS_BASE_URL: null,
  DISCOVERY_API_BASE_URL: null,
  ECOMMERCE_BASE_URL: null,
  PUBLISHER_BASE_URL: null,

  apps: {},
  pluginSlots: {},
  custom: {},

  APP_ID: '',
  BASE_URL: '',
  SITE_NAME: '',

  // Frontends
  ACCOUNT_PROFILE_URL: '',
  ACCOUNT_SETTINGS_URL: '',
  LEARNER_DASHBOARD_URL: '',
  LEARNING_BASE_URL: '',
  LOGIN_URL: '',
  LOGOUT_URL: '',
  MARKETING_SITE_BASE_URL: '',

  // Backends
  LMS_BASE_URL: '',
  STUDIO_BASE_URL: '',

  // Branding
  FAVICON_URL: '',
  LOGO_TRADEMARK_URL: '',
  LOGO_URL: '',
  LOGO_WHITE_URL: ''
};

/**
 * Getter for the application configuration document.  This is synchronous and merely returns a
 * reference to an existing object, and is thus safe to call as often as desired.
 *
 * Example:
 *
 * ```
 * import { getConfig } from '@openedx/frontend-base';
 *
 * const {
 *   LMS_BASE_URL,
 * } = getConfig();
 * ```
 *
 * @returns {ConfigDocument}
  */
export function getConfig() {
  return config;
}

/**
 * Replaces the existing ConfigDocument.  This is not commonly used, but can be helpful for tests.
 *
 * Example:
 *
 * ```
 * import { setConfig } from '@openedx/frontend-base';
 *
 * setConfig({
 *   LMS_BASE_URL, // This is overriding the ENTIRE document - this is not merged in!
 * });
 * ```
 *
 * @param {ConfigDocument} newConfig
 */
export function setConfig(newConfig: SiteConfig) {
  config = newConfig;
  publish(CONFIG_CHANGED);
}

/**
 * Merges additional configuration values into the site config returned by `getConfig`.  Will
 * override any values that exist with the same keys.
 *
 * ```
 * mergeConfig({
 *   NEW_KEY: 'new value',
 *   OTHER_NEW_KEY: 'other new value',
 * });
 *
 * This function uses lodash.merge internally to merge configuration objects
 * which means they will be merged recursively.  See https://lodash.com/docs/latest#merge for
 * documentation on the exact behavior.
 *
 * @param {Object} newConfig
 */
export function mergeConfig(newConfig: Partial<SiteConfig>) {
  config = merge(config, newConfig);
  publish(CONFIG_CHANGED);
}

export function patchAppModuleConfig(appId: string, appModuleConfig: ApplicationModuleConfig) {
  if (config.apps[appId] !== undefined) {
    const app = config.apps[appId];
    if (app.type === AppConfigTypes.INTERNAL || app.type === AppConfigTypes.FEDERATED) {
      const configurableApp = app as ConfigurableAppConfig;
      configurableApp.config = appModuleConfig;
    }
  }
}

/**
 * An object describing the current application configuration.
 *
 * In its most basic form, this document contains some sensible defaults. The initialization
 * process then merges additional configuration into this document using the configuration methods
 * described above. (Site configuration file, initialization config handler, and runtime
 * configuration)
 *
 * @name ConfigDocument
 * @memberof module:Config
 * @property {string} ACCESS_TOKEN_COOKIE_NAME
 * @property {string} ACCOUNT_PROFILE_URL
 * @property {string} ACCOUNT_SETTINGS_URL
 * @property {string} BASE_URL The URL of the current application.
 * @property {string} CREDENTIALS_BASE_URL
 * @property {string} CSRF_TOKEN_API_PATH
 * @property {string} DISCOVERY_API_BASE_URL
 * @property {string} PUBLISHER_BASE_URL
 * @property {string} ECOMMERCE_BASE_URL
 * @property {string} ENVIRONMENT This is one of: development, production, or test.
 * @property {string} IGNORED_ERROR_REGEX
 * @property {string} LANGUAGE_PREFERENCE_COOKIE_NAME
 * @property {string} LEARNING_BASE_URL
 * @property {string} LMS_BASE_URL
 * @property {string} LOGIN_URL
 * @property {string} LOGOUT_URL
 * @property {string} STUDIO_BASE_URL
 * @property {string} MARKETING_SITE_BASE_URL
 * @property {string} ORDER_HISTORY_URL
 * @property {string} REFRESH_ACCESS_TOKEN_API_PATH
 * @property {string} SEGMENT_KEY
 * @property {string} SITE_NAME
 * @property {string} USER_INFO_COOKIE_NAME
 * @property {string} LOGO_URL
 * @property {string} LOGO_TRADEMARK_URL
 * @property {string} LOGO_WHITE_URL
 * @property {string} FAVICON_URL
 * @property {string} MFE_CONFIG_API_URL
 * @property {string} APP_ID
 * @property {string} SUPPORT_URL
 */
