/**
 * #### Import members from **@openedx/frontend-base**
 *
 * The initialization module provides a function for managing an application's initialization
 * lifecycle.  It also provides constants and default handler implementations.
 *
 * ```
 * import {
 *   initialize,
 *   SITE_INIT_ERROR,
 *   SITE_READY,
 *   subscribe,
 *   SiteProvider,
 *   ErrorPage,
 *   PageWrap
 * } from '@openedx/frontend-base';
  * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import { Routes, Route } from 'react-router-dom';
 *
 * subscribe(SITE_READY, () => {
 *   ReactDOM.render(
 *     <SiteProvider>
 *       <Header />
 *       <main>
 *         <Routes>
 *           <Route path="/" element={<PageWrap><PaymentPage /></PageWrap>} />
 *         </Routes>
 *       </main>
 *       <Footer />
 *     </SiteProvider>,
 *     document.getElementById('root'),
 *   );
 * });
 *
 * subscribe(SITE_INIT_ERROR, (error) => {
 *   ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
 * });
 *
 * initialize({
 *   messages: [appMessages],
 *   requireAuthenticatedUser: true,
 *   hydrateAuthenticatedUser: true,
 * });

```
 * @module Initialization
 */

/*
This 'site.config' package is a special 'magic' alias in our webpack configuration in the `config`
folder. It points at an `site.config.tsx` file in the root of a site's repository.
*/
import siteConfig from 'site.config';
import {
  configureAnalytics,
  identifyAnonymousUser,
  identifyAuthenticatedUser,
  SegmentAnalyticsService,
} from './analytics';
import {
  AxiosJwtAuthService,
  configureAuth,
  ensureAuthenticatedUser,
  fetchAuthenticatedUser,
  getAuthenticatedHttpClient,
  getAuthenticatedUser,
  hydrateAuthenticatedUser,
} from './auth';
import configureCache from './auth/LocalForageCache';
import {
  getSiteConfig, mergeSiteConfig,
} from './config';
import {
  SITE_ANALYTICS_INITIALIZED,
  SITE_AUTH_INITIALIZED,
  SITE_CONFIG_INITIALIZED,
  SITE_I18N_INITIALIZED,
  SITE_INIT_ERROR,
  SITE_LOGGING_INITIALIZED,
  SITE_PUBSUB_INITIALIZED,
  SITE_READY,
} from './constants';
import { configureI18n } from './i18n';
import {
  configureLogging,
  getLoggingService,
  logError,
  NewRelicLoggingService,
} from './logging';
import { GoogleAnalyticsLoader } from './scripts';
import { publish } from './subscriptions';
import { EnvironmentTypes } from '../types';

/**
 * If set in configuration, a basename will be prepended to all relative routes under BrowserRouter.
 *
 * Unlike webpack's publicPath, the basename cannot be auto-discovered, so when publicPath is set
 * (or when it's set to 'auto' and the site is being served from a path other than '/') this
 * needs to be configured.
 */
export const getBasename = () => getSiteConfig().basename;

/**
 * The default handler for the initialization lifecycle's `initError` phase.  Logs the error to the
 * LoggingService using `logError`
 *
 * @see {@link module:frontend-base~logError}
 * @param {*} error
 */
export async function initError(error) {
  logError(error);
}

/**
 * The default handler for the initialization lifecycle's `auth` phase.
 *
 * The handler has several responsibilities:
 * - Determining the user's authentication state (authenticated or anonymous)
 * - Optionally redirecting to login if the application requires an authenticated user.
 * - Optionally loading additional user information via the application's user account data
 * endpoint.
 *
 * @param {boolean} requireUser Whether or not we should redirect to login if a user is not
 * authenticated.
 * @param {boolean} hydrateUser Whether or not we should fetch additional user account data.
 */
export async function auth(requireUser, hydrateUser) {
  if (requireUser) {
    await ensureAuthenticatedUser(globalThis.location.href);
  } else {
    await fetchAuthenticatedUser();
  }

  if (hydrateUser && getAuthenticatedUser() !== null) {
    // We intentionally do not await the promise returned by hydrateAuthenticatedUser. All the
    // critical data is returned as part of fetch/ensureAuthenticatedUser above, and anything else
    // is a nice-to-have for application code.
    hydrateAuthenticatedUser();
  }
}

/**
 * Set or overrides configuration via an site.config.tsx file in the consuming application.
 * This site.config.tsx is loaded at runtime and must export one of two things:
 *
 * - An object which will be merged into the application config via `mergeSiteConfig`.
 * - A function which returns an object which will be merged into the application config via
 * `mergeSiteConfig`.  This function can return a promise.
 */
async function fileConfig() {
  let config = {};
  if (typeof siteConfig === 'function') {
    config = await siteConfig();
  } else {
    config = siteConfig;
  }

  mergeSiteConfig(config);
}

/*
 * Set or overrides configuration through an API.
 * This method allows runtime configuration.
 * Set a basic configuration when an error happen and allow initError and display the ErrorPage.
 */
async function runtimeConfig() {
  try {
    const { runtimeConfigJsonUrl, environment } = getSiteConfig();

    if (runtimeConfigJsonUrl) {
      const apiConfig = { headers: { accept: 'application/json' } };
      const apiService = await configureCache();

      const runtimeConfigUrl = new URL(runtimeConfigJsonUrl);

      // In development mode, add a timestamp as a cache buster
      // to support live-editing runtime config JSON
      if (environment === EnvironmentTypes.DEVELOPMENT) {
        runtimeConfigUrl.searchParams.set('timestamp', Date.now());
      }

      const { data } = await apiService.get(runtimeConfigUrl.toString(), apiConfig);
      mergeSiteConfig(data, { appConfigOnly: true });
    }
  } catch (error) {
    console.error('Error with config API', error.message);
  }
}

export function loadExternalScripts(externalScripts, data) {
  externalScripts.forEach(ExternalScript => {
    const script = new ExternalScript(data);
    script.loadScript();
  });
}

/**
 * The default handler for the initialization lifecycle's `analytics` phase.
 *
 * The handler is responsible for identifying authenticated and anonymous users with the analytics
 * service.  This is a pre-requisite for sending analytics events, thus, we do it during the
 * initialization sequence so that analytics is ready once the application's UI code starts to load.
 *
 */
export async function analytics() {
  const authenticatedUser = getAuthenticatedUser();
  if (authenticatedUser?.userId) {
    identifyAuthenticatedUser(authenticatedUser.userId);
  } else {
    await identifyAnonymousUser();
  }
}

function applyOverrideHandlers(overrides) {
  const noOp = async () => { };
  return {
    pubSub: noOp,
    config: noOp,
    logging: noOp,
    auth,
    analytics,
    i18n: noOp,
    ready: noOp,
    initError,
    ...overrides, // This will override any same-keyed handlers from above.
  };
}

/**
 * Invokes the application initialization sequence.
 *
 * The sequence proceeds through a number of lifecycle phases, during which pertinent services are
 * configured.
 *
 * Using the `handlers` option, lifecycle phase handlers can be overridden to perform custom
 * functionality.  Note that while these override handlers _do_ replace the default handler
 * functionality for analytics, auth, and initError (the other phases have no default
 * functionality), they do _not_ override the configuration of the actual services that those
 * handlers leverage.
 *
 * Some services can be overridden via the loggingService and analyticsService options.  The other
 * services (auth and i18n) cannot currently be overridden.
 *
 * The following lifecycle phases exist:
 *
 * - pubSub: A no-op by default.
 * - config: A no-op by default.
 * - logging: A no-op by default.
 * - auth: Uses the 'auth' handler defined above.
 * - analytics: Uses the 'analytics' handler defined above.
 * - i18n: A no-op by default.
 * - ready: A no-op by default.
 * - initError: Uses the 'initError' handler defined above.
 *
 * @param {Object} [options]
 * @param {*} [options.loggingService=NewRelicLoggingService] The `LoggingService` implementation
 * to use.
 * @param {*} [options.analyticsService=SegmentAnalyticsService] The `AnalyticsService`
 * implementation to use.
 * @param {*} [options.authMiddleware=[]] An array of middleware to apply to http clients in the auth service.
 * @param {*} [options.externalScripts=[GoogleAnalyticsLoader]] An array of externalScripts.
 * By default added GoogleAnalyticsLoader.
 * @param {*} [options.requireAuthenticatedUser=false] If true, turns on automatic login
 * redirection for unauthenticated users.  Defaults to false, meaning that by default the
 * application will allow anonymous/unauthenticated sessions.
 * @param {*} [options.hydrateAuthenticatedUser=false] If true, makes an API call to the user
 * account endpoint (`${App.config.lmsBaseUrl}/api/user/v1/accounts/${username}`) to fetch
 * detailed account information for the authenticated user. This data is merged into the return
 * value of `getAuthenticatedUser`, overriding any duplicate keys that already exist. Defaults to
 * false, meaning that no additional account information will be loaded.
 * @param {*} [options.messages] A i18n-compatible messages object, or an array of such objects. If
 * an array is provided, duplicate keys are resolved with the last-one-in winning.
 * @param {*} [options.handlers={}] An optional object of handlers which can be used to replace the
 * default behavior of any part of the startup sequence. It can also be used to add additional
 * initialization behavior before or after the rest of the sequence.
 */
export async function initialize({
  loggingService = NewRelicLoggingService,
  analyticsService = SegmentAnalyticsService,
  authService = AxiosJwtAuthService,
  authMiddleware = [],
  externalScripts = [GoogleAnalyticsLoader],
  requireAuthenticatedUser: requireUser = false,
  hydrateAuthenticatedUser: hydrateUser = false,
  messages,
  handlers: overrideHandlers = {},
}) {
  const handlers = applyOverrideHandlers(overrideHandlers);
  try {
    // Pub/Sub
    await handlers.pubSub();
    publish(SITE_PUBSUB_INITIALIZED);

    // Configuration
    await fileConfig();
    await handlers.config();
    await runtimeConfig();
    publish(SITE_CONFIG_INITIALIZED);

    loadExternalScripts(externalScripts, {
      config: getSiteConfig(),
    });

    // This allows us to replace the implementations of the logging, analytics, and auth services
    // based on keys in the SiteConfig.  The JavaScript File Configuration method is the only
    // one capable of supplying an alternate implementation since it can import other modules.
    // If a service wasn't supplied we fall back to the default parameters on the initialize
    // function signature.
    const loggingServiceImpl = getSiteConfig().loggingService ?? loggingService;
    const analyticsServiceImpl = getSiteConfig().analyticsService ?? analyticsService;
    const authServiceImpl = getSiteConfig().authService ?? authService;

    // Logging
    configureLogging(loggingServiceImpl, {
      config: getSiteConfig(),
    });
    await handlers.logging();
    publish(SITE_LOGGING_INITIALIZED);

    // Internationalization
    configureI18n({
      messages,
    });
    await handlers.i18n();
    publish(SITE_I18N_INITIALIZED);

    // Authentication
    configureAuth(authServiceImpl, {
      loggingService: getLoggingService(),
      config: getSiteConfig(),
      middleware: authMiddleware,
    });

    await handlers.auth(requireUser, hydrateUser);
    publish(SITE_AUTH_INITIALIZED);

    // Analytics
    configureAnalytics(analyticsServiceImpl, {
      config: getSiteConfig(),
      loggingService: getLoggingService(),
      httpClient: getAuthenticatedHttpClient(),
    });
    await handlers.analytics();
    publish(SITE_ANALYTICS_INITIALIZED);

    // Application Ready
    await handlers.ready();
    publish(SITE_READY);
  } catch (error) {
    if (!error.isRedirecting) {
      // Initialization Error
      await handlers.initError(error);
      publish(SITE_INIT_ERROR, error);
    }
  }
}
