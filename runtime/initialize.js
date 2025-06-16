/**
 * #### Import members from **@openedx/frontend-base**
 *
 * The initialization module provides a function for managing an application's initialization
 * lifecycle.  It also provides constants and default handler implementations.
 *
 * ```
 * import {
 *   initialize,
 *   APP_INIT_ERROR,
 *   APP_READY,
 *   subscribe,
 *   SiteProvider,
 *   ErrorPage,
 *   PageWrap
 * } from '@openedx/frontend-base';
  * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import { Routes, Route } from 'react-router-dom';
 *
 * subscribe(APP_READY, () => {
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
 * subscribe(APP_INIT_ERROR, (error) => {
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

import {
  createBrowserHistory,
  createMemoryHistory
} from 'history';
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
  getConfig, mergeConfig,
  patchAppConfig
} from './config';
import {
  APP_ANALYTICS_INITIALIZED,
  APP_AUTH_INITIALIZED,
  APP_CONFIG_INITIALIZED,
  APP_I18N_INITIALIZED,
  APP_INIT_ERROR,
  APP_LOGGING_INITIALIZED,
  APP_PUBSUB_INITIALIZED,
  APP_READY,
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
import { getPath } from './utils';

/**
 * A browser history or memory history object created by the [history](https://github.com/ReactTraining/history)
 * package.  Applications are encouraged to use this history object, rather than creating their own,
 * as behavior may be undefined when managing history via multiple mechanisms/instances. Note that
 * in environments where browser history may be inaccessible due to `window` being undefined, this
 * falls back to memory history.
 */
export const getHistory = () => ((typeof window !== 'undefined')
  ? createBrowserHistory({ basename: getPath(getConfig().publicPath) })
  : createMemoryHistory());

/**
 * The string basename that is the root directory of this MFE.
 *
 * In devstack, this should always just return "/", because each MFE is in its own server/domain.
 *
 * In Tutor, all MFEs are deployed to a common server, each under a different top-level directory.
 * The basename is the root path for a given MFE, e.g. "/library-authoring". It is set by tutor-mfe
 * as an ENV variable in the Docker file, and we read it here from that configuration so that it
 * can be passed into a Router later.
 */
export const getBasename = () => getPath(getConfig().publicPath);

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
 * - An object which will be merged into the application config via `mergeConfig`.
 * - A function which returns an object which will be merged into the application config via
 * `mergeConfig`.  This function can return a promise.
 */
async function fileConfig() {
  let config = {};
  if (typeof siteConfig === 'function') {
    config = await siteConfig();
  } else {
    config = siteConfig;
  }

  // This means the SiteConfig is acting as an app, i.e., 'standalone mode' which allows an MFE to be
  // built as its own site using the shell.  In that case, we need to move all the 'standalone' config
  // into our appConfigs object so it can be accessed by the code.
  if (config.standalone !== undefined) {
    patchAppConfig(config.standalone);
    delete config.standalone;
  }

  mergeConfig(config);
}

/*
 * Set or overrides configuration through an API.
 * This method allows runtime configuration.
 * Set a basic configuration when an error happen and allow initError and display the ErrorPage.
 */
async function runtimeConfig() {
  try {
    const { mfeConfigApiUrl, siteId } = getConfig();

    if (mfeConfigApiUrl) {
      const apiConfig = { headers: { accept: 'application/json' } };
      const apiService = await configureCache();

      const params = new URLSearchParams();
      params.append('mfe', siteId);
      const url = `${mfeConfigApiUrl}?${params.toString()}`;

      const { data } = await apiService.get(url, apiConfig);
      mergeConfig(data);
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
    publish(APP_PUBSUB_INITIALIZED);

    // Configuration
    await fileConfig();
    await handlers.config();
    await runtimeConfig();
    publish(APP_CONFIG_INITIALIZED);

    loadExternalScripts(externalScripts, {
      config: getConfig(),
    });

    // This allows us to replace the implementations of the logging, analytics, and auth services
    // based on keys in the SiteConfig.  The JavaScript File Configuration method is the only
    // one capable of supplying an alternate implementation since it can import other modules.
    // If a service wasn't supplied we fall back to the default parameters on the initialize
    // function signature.
    const loggingServiceImpl = getConfig().loggingService || loggingService;
    const analyticsServiceImpl = getConfig().analyticsService || analyticsService;
    const authServiceImpl = getConfig().authService || authService;

    // Logging
    configureLogging(loggingServiceImpl, {
      config: getConfig(),
    });
    await handlers.logging();
    publish(APP_LOGGING_INITIALIZED);

    // Internationalization
    configureI18n({
      messages,
    });
    await handlers.i18n();
    publish(APP_I18N_INITIALIZED);

    // Authentication
    configureAuth(authServiceImpl, {
      loggingService: getLoggingService(),
      config: getConfig(),
      middleware: authMiddleware,
    });

    await handlers.auth(requireUser, hydrateUser);
    publish(APP_AUTH_INITIALIZED);

    // Analytics
    configureAnalytics(analyticsServiceImpl, {
      config: getConfig(),
      loggingService: getLoggingService(),
      httpClient: getAuthenticatedHttpClient(),
    });
    await handlers.analytics();
    publish(APP_ANALYTICS_INITIALIZED);

    // Application Ready
    await handlers.ready();
    publish(APP_READY);
  } catch (error) {
    if (!error.isRedirecting) {
      // Initialization Error
      await handlers.initError(error);
      publish(APP_INIT_ERROR, error);
    }
  }
}
