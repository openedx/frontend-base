/**
 * #### Import members from **@openedx/frontend-base logging**
 *
 * Contains a shared interface for logging information. (The default implementation is in
 * NewRelicLoggingService.js.) When in development mode, all messages will instead be sent to the console.
 *
 * The `initialize` function performs much of the logging configuration for you.  If, however,
 * you're not using the `initialize` function, logging (via New Relic) can be configured via:
 *
 * ```
 * import { getSiteConfig, configureLogging, NewRelicLoggingService, logInfo, logError } from '@openedx/frontend-base';
 *
 * configureLogging(NewRelicLoggingService, {
 *   config: getSiteConfig(),
 * });
 *
 * logInfo('Just so you know...');
 * logInfo(new Error('Unimportant error'), { type: 'unimportant' });
 * logError('Uhoh!');
 * logError(new Error('Uhoh error!'));
 * ```
 *
 * As shown in this example, logging depends on the configuration document.
 *
 * @module Logging
 */

import PropTypes from 'prop-types';

const optionsShape = {
  config: PropTypes.object.isRequired,
};

const serviceShape = {
  logInfo: PropTypes.func.isRequired,
  logError: PropTypes.func.isRequired,
};

let service = null;

/**
 *
 */
export function configureLogging(LoggingService, options) {
  PropTypes.checkPropTypes(optionsShape, options, 'property', 'Logging');
  service = new LoggingService(options);
  PropTypes.checkPropTypes(serviceShape, service, 'property', 'LoggingService');
  return service;
}

/**
 * Logs a message to the 'info' log level. Can accept custom attributes as a property of the error
 * object, or as an optional second parameter.
 *
 * @param {string|Error} infoStringOrErrorObject
 * @param {Object} [customAttributes={}]
 */
export function logInfo(infoStringOrErrorObject, customAttributes) {
  return service.logInfo(infoStringOrErrorObject, customAttributes);
}

/**
 * Logs a message to the 'error' log level.  Can accept custom attributes as a property of the error
 * object, or as an optional second parameter.
 *
 * @param {string|Error} errorStringOrObject
 * @param {Object} [customAttributes={}]
 */
export function logError(errorStringOrObject, customAttributes) {
  return service.logError(errorStringOrObject, customAttributes);
}

/**
 * Sets a custom attribute that will be included with all subsequent log messages.
 *
 * @param {string} name
 * @param {string|number|null} value
 */
export function setCustomAttribute(name, value) {
  return service.setCustomAttribute(name, value);
}

/**
 *
 * @throws {Error} Thrown if the logging service has not yet been configured via {@link configureLogging}.
 * @returns {LoggingService}
 */
export function getLoggingService() {
  if (!service) {
    throw Error('You must first configure the logging service.');
  }
  return service;
}

/**
 * Sets the configured logging service back to null.
 *
 */
export function resetLoggingService() {
  service = null;
}

/**
 * @name LoggingService
 * @interface
 * @memberof module:Logging
 * @property {function} logError
 * @property {function} logInfo
 */
