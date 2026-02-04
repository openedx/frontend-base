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
import { initialize } from './initialize';

import { configureAnalytics, SegmentAnalyticsService } from './analytics';
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
import { addAppConfigs, getAppConfig, getSiteConfig, mergeSiteConfig } from './config';
import { configureI18n } from './i18n';
import {
  configureLogging,
  getLoggingService,
  logError,
  NewRelicLoggingService,
} from './logging';
import { clearAllSubscriptions, subscribe } from './subscriptions';

jest.mock('./logging');
jest.mock('./auth');
jest.mock('./analytics');
jest.mock('./i18n');
jest.mock('./auth/LocalForageCache');

let config = null;

describe('initialize', () => {
  beforeEach(() => {
    config = getSiteConfig();
    fetchAuthenticatedUser.mockReset();
    ensureAuthenticatedUser.mockReset();
    hydrateAuthenticatedUser.mockReset();
    logError.mockReset();
    clearAllSubscriptions();
  });

  it('should call default handlers in the absence of overrides', async () => {
    const expectedEvents = [
      SITE_PUBSUB_INITIALIZED,
      SITE_CONFIG_INITIALIZED,
      SITE_LOGGING_INITIALIZED,
      SITE_AUTH_INITIALIZED,
      SITE_ANALYTICS_INITIALIZED,
      SITE_I18N_INITIALIZED,
      SITE_READY,
    ];

    function checkDispatchedDone(eventName) {
      const index = expectedEvents.indexOf(eventName);
      if (index > -1) {
        expectedEvents.splice(index, 1);
      } else {
        throw new Error(`Unexpected event dispatched! ${eventName}`);
      }
    }

    subscribe(SITE_PUBSUB_INITIALIZED, checkDispatchedDone);
    subscribe(SITE_CONFIG_INITIALIZED, checkDispatchedDone);
    subscribe(SITE_LOGGING_INITIALIZED, checkDispatchedDone);
    subscribe(SITE_AUTH_INITIALIZED, checkDispatchedDone);
    subscribe(SITE_ANALYTICS_INITIALIZED, checkDispatchedDone);
    subscribe(SITE_I18N_INITIALIZED, checkDispatchedDone);
    subscribe(SITE_READY, checkDispatchedDone);

    const messages = { i_am: 'a message' };
    await initialize({ messages });

    expect(configureLogging).toHaveBeenCalledWith(NewRelicLoggingService, { config });
    expect(configureAuth).toHaveBeenCalledWith(AxiosJwtAuthService, {
      loggingService: getLoggingService(),
      config,
      middleware: [],
    });
    expect(configureAnalytics).toHaveBeenCalledWith(SegmentAnalyticsService, {
      config,
      loggingService: getLoggingService(),
      httpClient: getAuthenticatedHttpClient(),
    });
    expect(configureI18n).toHaveBeenCalledWith({
      messages,
    });
    expect(fetchAuthenticatedUser).toHaveBeenCalled();
    expect(ensureAuthenticatedUser).not.toHaveBeenCalled();
    expect(hydrateAuthenticatedUser).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('should call ensureAuthenticatedUser', async () => {
    const messages = { i_am: 'a message' };
    await initialize({ messages, requireAuthenticatedUser: true });

    expect(fetchAuthenticatedUser).not.toHaveBeenCalled();
    expect(ensureAuthenticatedUser).toHaveBeenCalled();
    expect(hydrateAuthenticatedUser).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('should call hydrateAuthenticatedUser if option is set and authenticated', async () => {
    getAuthenticatedUser.mockReturnValue({ userId: 'abc123', username: 'Barry' });

    const messages = { i_am: 'a message' };
    await initialize({ messages, hydrateAuthenticatedUser: true });

    expect(fetchAuthenticatedUser).toHaveBeenCalled();
    expect(ensureAuthenticatedUser).not.toHaveBeenCalled();
    expect(hydrateAuthenticatedUser).toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('should not call hydrateAuthenticatedUser if option is set but anonymous', async () => {
    getAuthenticatedUser.mockReturnValue(null);

    const messages = { i_am: 'a message' };
    await initialize({ messages, hydrateAuthenticatedUser: true });

    expect(fetchAuthenticatedUser).toHaveBeenCalled();
    expect(ensureAuthenticatedUser).not.toHaveBeenCalled();
    expect(hydrateAuthenticatedUser).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('should call override handlers if they exist', async () => {
    const overrideHandlers = {
      pubSub: jest.fn(),
      config: jest.fn(),
      logging: jest.fn(),
      auth: jest.fn(),
      analytics: jest.fn(),
      i18n: jest.fn(),
      ready: jest.fn(),
      initError: jest.fn(),
    };

    await initialize({
      messages: null,
      handlers: overrideHandlers,
    });

    expect(overrideHandlers.pubSub).toHaveBeenCalled();
    expect(overrideHandlers.config).toHaveBeenCalled();
    expect(overrideHandlers.logging).toHaveBeenCalled();
    expect(overrideHandlers.auth).toHaveBeenCalled();
    expect(overrideHandlers.analytics).toHaveBeenCalled();
    expect(overrideHandlers.i18n).toHaveBeenCalled();
    expect(overrideHandlers.ready).toHaveBeenCalled();
    expect(overrideHandlers.initError).not.toHaveBeenCalled();
    expect(fetchAuthenticatedUser).not.toHaveBeenCalled();
    expect(ensureAuthenticatedUser).not.toHaveBeenCalled();
    expect(hydrateAuthenticatedUser).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('should call the default initError handler if something throws', async () => {
    const overrideHandlers = {
      pubSub: jest.fn(() => {
        throw new Error('uhoh!');
      }),
      config: jest.fn(),
      logging: jest.fn(),
      auth: jest.fn(),
      analytics: jest.fn(),
      i18n: jest.fn(),
      ready: jest.fn(),
    };

    function errorHandler(eventName, data) {
      expect(eventName).toEqual(SITE_INIT_ERROR);
      expect(data).toEqual(new Error('uhoh!'));
    }

    subscribe(SITE_INIT_ERROR, errorHandler);

    await initialize({
      messages: null,
      handlers: overrideHandlers,
    });

    expect(overrideHandlers.pubSub).toHaveBeenCalled();
    expect(overrideHandlers.config).not.toHaveBeenCalled();
    expect(overrideHandlers.logging).not.toHaveBeenCalled();
    expect(overrideHandlers.auth).not.toHaveBeenCalled();
    expect(overrideHandlers.analytics).not.toHaveBeenCalled();
    expect(overrideHandlers.i18n).not.toHaveBeenCalled();
    expect(overrideHandlers.ready).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith(new Error('uhoh!'));
  });

  it('should call the override initError handler if something throws', async () => {
    const overrideHandlers = {
      pubSub: jest.fn(() => {
        throw new Error('uhoh!');
      }),
      config: jest.fn(),
      logging: jest.fn(),
      auth: jest.fn(),
      analytics: jest.fn(),
      i18n: jest.fn(),
      ready: jest.fn(),
      initError: jest.fn(),
    };

    function errorHandler(eventName, data) {
      expect(eventName).toEqual(SITE_INIT_ERROR);
      expect(data).toEqual(new Error('uhoh!'));
    }

    subscribe(SITE_INIT_ERROR, errorHandler);

    await initialize({
      messages: null,
      handlers: overrideHandlers,
    });

    expect(overrideHandlers.pubSub).toHaveBeenCalled();
    expect(overrideHandlers.config).not.toHaveBeenCalled();
    expect(overrideHandlers.logging).not.toHaveBeenCalled();
    expect(overrideHandlers.auth).not.toHaveBeenCalled();
    expect(overrideHandlers.analytics).not.toHaveBeenCalled();
    expect(overrideHandlers.i18n).not.toHaveBeenCalled();
    expect(overrideHandlers.ready).not.toHaveBeenCalled();
    expect(overrideHandlers.initError).toHaveBeenCalledWith(new Error('uhoh!'));
  });

  it('should merge runtime configuration with build-time configuration', async () => {
    const runtimeConfig = {
      siteName: 'Runtime Site Name',
      supportEmail: 'runtime-support@example.com',
    };

    configureCache.mockReturnValueOnce(Promise.resolve({
      get: () => ({ data: runtimeConfig }),
    }));

    const messages = { i_am: 'a message' };
    await initialize({
      messages,
      handlers: {
        config: () => {
          mergeSiteConfig({
            runtimeConfigJsonUrl: 'http://localhost:18000/api/mfe/v1/config.json',
            siteName: 'Build Time Site Name',
            lmsBaseUrl: 'http://localhost:18000',
          });
        }
      }
    });

    expect(configureCache).toHaveBeenCalled();
    expect(configureLogging).toHaveBeenCalledWith(NewRelicLoggingService, { config });
    expect(configureAuth).toHaveBeenCalledWith(AxiosJwtAuthService, {
      loggingService: getLoggingService(),
      config,
      middleware: [],
    });
    expect(configureAnalytics).toHaveBeenCalledWith(SegmentAnalyticsService, {
      config,
      loggingService: getLoggingService(),
      httpClient: getAuthenticatedHttpClient(),
    });
    expect(configureI18n).toHaveBeenCalledWith({
      messages,
    });

    expect(fetchAuthenticatedUser).toHaveBeenCalled();
    expect(ensureAuthenticatedUser).not.toHaveBeenCalled();
    expect(hydrateAuthenticatedUser).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();

    // Runtime config should override build-time config for matching keys
    expect(getSiteConfig().siteName).toBe('Runtime Site Name');
    // Build-time values not in runtime config should be preserved
    expect(getSiteConfig().lmsBaseUrl).toBe('http://localhost:18000');
    // Runtime values not in build-time config should be added
    expect(getSiteConfig().supportEmail).toBe('runtime-support@example.com');
  });

  it('should merge app-level runtime configuration with build-time configuration', async () => {
    const runtimeConfig = {
      apps: [{
        appId: 'test-app',
        config: {
          FEATURE_FLAG: true,
          INFO_EMAIL: 'runtime@example.com',
        },
      }],
    };

    configureCache.mockReturnValueOnce(Promise.resolve({
      get: () => ({ data: runtimeConfig }),
    }));

    const messages = { i_am: 'a message' };
    await initialize({
      messages,
      handlers: {
        config: () => {
          mergeSiteConfig({
            runtimeConfigJsonUrl: 'http://localhost:18000/api/mfe/v1/config.json',
            apps: [{
              appId: 'test-app',
              config: {
                INFO_EMAIL: 'buildtime@example.com',
                LOGO_URL: 'http://localhost/logo.png',
              },
            }],
          });
        }
      }
    });

    expect(configureCache).toHaveBeenCalled();

    // Simulate shell behavior - extract app configs from merged site config
    addAppConfigs();

    const appConfig = getAppConfig('test-app');
    // Runtime config should override build-time app config
    expect(appConfig.INFO_EMAIL).toBe('runtime@example.com');
    // Build-time app config not in runtime should be preserved
    expect(appConfig.LOGO_URL).toBe('http://localhost/logo.png');
    // Runtime app config not in build-time should be added
    expect(appConfig.FEATURE_FLAG).toBe(true);
  });

  describe('with mocked console.error', () => {
    beforeEach(() => {
      console.error = jest.fn();
    });

    afterAll(() => {
      console.error.mockRestore();
    });

    it('should initialize the app with the build config when runtime configuration fails', async () => {
      configureCache.mockRejectedValueOnce(new Error('Api fails'));

      const messages = { i_am: 'a message' };
      await initialize({
        messages,
        handlers: {
          config: () => {
            mergeSiteConfig({
              runtimeConfigJsonUrl: 'http://localhost:18000/api/mfe/v1/config.json',
            });
          }
        }
      });

      expect(configureCache).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error with config API', 'Api fails');
      expect(configureLogging).toHaveBeenCalledWith(NewRelicLoggingService, { config });
      expect(configureAuth).toHaveBeenCalledWith(AxiosJwtAuthService, {
        loggingService: getLoggingService(),
        config,
        middleware: [],
      });
      expect(configureAnalytics).toHaveBeenCalledWith(SegmentAnalyticsService, {
        config,
        loggingService: getLoggingService(),
        httpClient: getAuthenticatedHttpClient(),
      });
      expect(configureI18n).toHaveBeenCalledWith({
        messages,
      });
      expect(fetchAuthenticatedUser).toHaveBeenCalled();
      expect(ensureAuthenticatedUser).not.toHaveBeenCalled();
      expect(hydrateAuthenticatedUser).not.toHaveBeenCalled();
      expect(logError).not.toHaveBeenCalled();
    });
  });
});
