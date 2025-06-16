/**
 * #### Import members from **@openedx/frontend-base** Analytics
 *
 * Contains a shared interface for tracking events.  Has a default implementation of
 * SegmentAnalyticsService, which supports Segment and the Tracking Log API (hosted in LMS).
 *
 * The `initialize` function performs much of the analytics configuration for you.  If, however,
 * you're not using the `initialize` function, analytics can be configured via:
 *
 * ```
 * import {
 *   getSiteConfig,
 *   getAuthenticatedHttpClient,
 *   getLoggingService,
 *   configureAnalytics,
 *   SegmentAnalyticsService
 * } from '@openedx/frontend-base';
 *
 * configureAnalytics(SegmentAnalyticsService, {
 *   config: getSiteConfig(),
 *   loggingService: getLoggingService(),
 *   httpClient: getAuthenticatedHttpClient(),
 * });
 * ```
 *
 * As shown in this example, analytics depends on the configuration document, logging, and having
 * an authenticated HTTP client.
 *
 * @module Analytics
 */
import PropTypes from 'prop-types';

const optionsShape = {
  config: PropTypes.object.isRequired,
  httpClient: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  loggingService: PropTypes.shape({
    logError: PropTypes.func.isRequired,
    logInfo: PropTypes.func.isRequired,
  }).isRequired,
};

const serviceShape = {
  sendTrackingLogEvent: PropTypes.func.isRequired,
  identifyAuthenticatedUser: PropTypes.func.isRequired,
  identifyAnonymousUser: PropTypes.func.isRequired,
  sendTrackEvent: PropTypes.func.isRequired,
  sendPageEvent: PropTypes.func.isRequired,
};

let service;

/**
 *
 * @param {class} AnalyticsService
 * @param {*} options
 * @returns {AnalyticsService}
 */
export function configureAnalytics(AnalyticsService, options) {
  PropTypes.checkPropTypes(optionsShape, options, 'property', 'Analytics');
  service = new AnalyticsService(options);
  PropTypes.checkPropTypes(serviceShape, service, 'property', 'AnalyticsService');
  return service;
}

/**
 *
 * @param {*} eventName
 * @param {*} properties
 * @returns {Promise}
 */
export function sendTrackingLogEvent(eventName, properties) {
  return service.sendTrackingLogEvent(eventName, properties);
}

/**
 *
 *
 * @param {*} userId
 * @param {*} traits
 */
export function identifyAuthenticatedUser(userId, traits) {
  service.identifyAuthenticatedUser(userId, traits);
}

/**
 *
 *
 * @param {*} traits
 * @returns {Promise}
 */
export function identifyAnonymousUser(traits) {
  return service.identifyAnonymousUser(traits);
}

/**
 *
 *
 * @param {*} eventName
 * @param {*} properties
 */
export function sendTrackEvent(eventName, properties) {
  service.sendTrackEvent(eventName, properties);
}

/**
 *
 *
 * @param {*} category
 * @param {*} name
 * @param {*} properties
 */
export function sendPageEvent(category, name, properties) {
  service.sendPageEvent(category, name, properties);
}

/**
 *
 *
 * @returns {AnalyticsService}
 */
export function getAnalyticsService() {
  if (!service) {
    throw Error('You must first configure the analytics service.');
  }

  return service;
}

/**
 *
 */
export function resetAnalyticsService() {
  service = null;
}

/**
 * @name AnalyticsService
 * @interface
 * @memberof module:Analytics
 * @property {function} identifyAnonymousUser
 * @property {function} identifyAuthenticatedUser
 * @property {function} sendPageEvent
 * @property {function} sendTrackEvent
 * @property {function} sendTrackingLogEvent
 */
