/** @constant */
export const SITE_TOPIC = 'APP';

export const SITE_PUBSUB_INITIALIZED = `${SITE_TOPIC}.PUBSUB_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished loading any dynamic
 * configuration setup in a custom config handler.
 *
 * @event
 */
export const SITE_CONFIG_INITIALIZED = `${SITE_TOPIC}.CONFIG_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished determining the user's
 * authentication state, creating an authenticated API client, and executing auth handlers.
 *
 * @event
 */
export const SITE_AUTH_INITIALIZED = `${SITE_TOPIC}.AUTH_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished initializing
 * internationalization and executing any i18n handlers.
 *
 * @event
 */
export const SITE_I18N_INITIALIZED = `${SITE_TOPIC}.I18N_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished initializing the
 * logging service and executing any logging handlers.
 *
 * @event
 */
export const SITE_LOGGING_INITIALIZED = `${SITE_TOPIC}.LOGGING_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished initializing the
 * analytics service and executing any analytics handlers.
 *
 * @event
 */
export const SITE_ANALYTICS_INITIALIZED = `${SITE_TOPIC}.ANALYTICS_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished.  Applications should
 * subscribe to this event and start rendering the UI when it has fired.
 *
 * @event
 */
export const SITE_READY = `${SITE_TOPIC}.READY`;

/**
 * Event published when the application initialization sequence has aborted.  This is frequently
 * used to show an error page when an initialization error has occurred.
 *
 * @see {@link module:React~ErrorPage}
 * @event
 */
export const SITE_INIT_ERROR = `${SITE_TOPIC}.INIT_ERROR`;

/** @constant */
export const CONFIG_TOPIC = 'CONFIG';

export const CONFIG_CHANGED = `${CONFIG_TOPIC}.CHANGED`;

export const ACTIVE_ROLES_CHANGED = 'ACTIVE_ROLES_CHANGED';
