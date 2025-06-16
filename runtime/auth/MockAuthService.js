import axios from 'axios';
import PropTypes from 'prop-types';

const userPropTypes = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  administrator: PropTypes.boolean,
});

const optionsPropTypes = {
  config: PropTypes.shape({
    baseUrl: PropTypes.string.isRequired,
    lmsBaseUrl: PropTypes.string.isRequired,
    loginUrl: PropTypes.string.isRequired,
    logoutUrl: PropTypes.string.isRequired,
    refreshAccessTokenApiPath: PropTypes.string.isRequired,
    accessTokenCookieName: PropTypes.string.isRequired,
    csrfTokenApiPath: PropTypes.string.isRequired,
  }).isRequired,
  loggingService: PropTypes.shape({
    logError: PropTypes.func.isRequired,
    logInfo: PropTypes.func.isRequired,
  }).isRequired,
  // The absence of authenticatedUser means the user is anonymous.
  authenticatedUser: userPropTypes,
  // Must be at least a valid user, but may have other fields.
  hydratedAuthenticatedUser: userPropTypes,
};

/**
 * The MockAuthService class mocks authenticated user-fetching logic and allows for manually
 * setting user data.  It is compatible with axios-mock-adapter to wrap its HttpClients so that
 * they can be mocked for testing.
 *
 * It wraps all methods of the service with Jest mock functions (jest.fn()).  This allows test code
 * to assert expectations on all functions of the service while preserving sensible behaviors.  For
 * instance, the login/logout methods related to redirecting maintain their real behavior.
 *
 * This service is NOT suitable for use in an application itself - only tests.  It depends on Jest,
 * which should only be a dev dependency of your project.  You don't want to pull the entire suite
 * of test dependencies into your application at runtime, probably even in your dev server.
 *
 * In a test where you would like to mock out API requests - perhaps from a redux-thunk function -
 * you could do the following to set up a MockAuthService for your test:
 *
 * ```
 * import { getSiteConfig, mergeSiteConfig, configureAuth, MockAuthService } from '@openedx/frontend-base';
 * import MockAdapter from 'axios-mock-adapter';
 *
 * const mockLoggingService = {
 *   logInfo: jest.fn(),
 *   logError: jest.fn(),
 * };
 * mergeSiteConfig({
 *   authenticatedUser: {
 *     userId: 'abc123',
 *     username: 'Mock User',
 *     roles: [],
 *     administrator: false,
 *   },
 * });
 * configureAuth(MockAuthService, { config: getSiteConfig(), loggingService: mockLoggingService });
 * const mockAdapter = new MockAdapter(getAuthenticatedHttpClient());
 * // Mock calls for your tests.  This configuration can be done in any sort of test setup.
 * mockAdapter.onGet(...);
 * ```
 *
 * Also see the `initializeMockApp` function which also automatically uses mock services for
 * Logging and Analytics.
 *
 * @implements {AuthService}
 * @memberof module:Auth
 */
class MockAuthService {
  /**
   * @param {Object} options
   * @param {Object} options.config
   * @param {string} options.config.baseUrl
   * @param {string} options.config.lmsBaseUrl
   * @param {string} options.config.loginUrl
   * @param {string} options.config.logoutUrl
   * @param {string} options.config.refreshAccessTokenApiPath
   * @param {string} options.config.accessTokenCookieName
   * @param {string} options.config.csrfTokenApiPath
   * @param {Object} options.loggingService requires logError and logInfo methods
   */
  constructor(options) {
    this.authenticatedHttpClient = null;
    this.httpClient = null;

    PropTypes.checkPropTypes(optionsPropTypes, options, 'options', 'AuthService');

    this.config = options.config;
    this.loggingService = options.loggingService;

    // Mock user
    this.authenticatedUser = null;
    this.hydratedAuthenticatedUser = {};

    this.authenticatedHttpClient = axios.create();
    this.httpClient = axios.create();
  }

  /**
   * A Jest mock function (jest.fn())
   *
   * Applies middleware to the axios instances in this service.
   *
   * @param {Array} middleware Middleware to apply.
   */
  applyMiddleware(middleware = []) {
    const clients = [
      this.authenticatedHttpClient, this.httpClient,
      this.cachedAuthenticatedHttpClient, this.cachedHttpClient,
    ];
    try {
      (middleware).forEach((middlewareFn) => {
        clients.forEach((client) => client && middlewareFn(client));
      });
    } catch (error) {
      throw new Error(`Failed to apply middleware: ${error.message}.`);
    }
  }

  /**
   * A Jest mock function (jest.fn())
   *
   * Gets the authenticated HTTP client instance, which is an axios client wrapped in
   * MockAdapter from axios-mock-adapter.
   *
   * @returns {HttpClient} An HttpClient wrapped in MockAdapter.
   */
  getAuthenticatedHttpClient = jest.fn(() => this.authenticatedHttpClient);

  /**
   * A Jest mock function (jest.fn())
   *
   * Gets the unauthenticated HTTP client instance, which is an axios client wrapped in
   * MockAdapter from axios-mock-adapter.
   *
   * @returns {HttpClient} An HttpClient wrapped in MockAdapter.
   */
  getHttpClient = jest.fn(() => this.httpClient);

  /**
   * A Jest mock function (jest.fn())
   *
   * Builds a URL to the login page with a post-login redirect URL attached as a query parameter.
   *
   * ```
   * const url = getLoginRedirectUrl('http://localhost/mypage');
   * console.log(url); // http://localhost/login?next=http%3A%2F%2Flocalhost%2Fmypage
   * ```
   *
   * @param {string} redirectUrl The URL the user should be redirected to after logging in.
   */
  getLoginRedirectUrl = jest.fn(
    (redirectUrl = this.config.baseUrl) => `${this.config.loginUrl}?next=${encodeURIComponent(redirectUrl)}`,
  );

  /**
   * A Jest mock function (jest.fn())
   *
   * Redirects the user to the logout page in the real implementation.  Is a no-op here.
   *
   * @param {string} redirectUrl The URL the user should be redirected to after logging in.
   */
  redirectToLogin = jest.fn((redirectUrl = this.config.baseUrl) => {
    // Do nothing after getting the URL - this preserves the calls properly, but doesn't redirect.
    this.getLoginRedirectUrl(redirectUrl);
  });

  /**
   * A Jest mock function (jest.fn())
   *
   * Builds a URL to the logout page with a post-logout redirect URL attached as a query parameter.
   *
   * ```
   * const url = getLogoutRedirectUrl('http://localhost/mypage');
   * console.log(url); // http://localhost/logout?next=http%3A%2F%2Flocalhost%2Fmypage
   * ```
   *
   * @param {string} redirectUrl The URL the user should be redirected to after logging out.
   */
  getLogoutRedirectUrl = jest.fn((redirectUrl = this.config.baseUrl) => `${this.config.logoutUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`);

  /**
   * A Jest mock function (jest.fn())
   *
   * Redirects the user to the logout page in the real implementation.  Is a no-op here.
   *
   * @param {string} redirectUrl The URL the user should be redirected to after logging out.
   */
  redirectToLogout = jest.fn((redirectUrl = this.config.baseUrl) => {
    // Do nothing after getting the URL - this preserves the calls properly, but doesn't redirect.
    this.getLogoutRedirectUrl(redirectUrl);
  });

  /**
   * A Jest mock function (jest.fn())
   *
   * If it exists, returns the user data representing the currently authenticated user. If the
   * user is anonymous, returns null.
   *
   * @returns {UserData|null}
   */
  getAuthenticatedUser = jest.fn(() => this.authenticatedUser);

  /**
   * A Jest mock function (jest.fn())
   *
   * Sets the authenticated user to the provided value.
   *
   * @param {UserData} authUser
   */
  setAuthenticatedUser = jest.fn((authUser) => {
    this.authenticatedUser = authUser;
  });

  /**
   * A Jest mock function (jest.fn())
   *
   * Returns the current authenticated user details, as supplied in the `authenticatedUser` field
   * of the config options.  Resolves to null if the user is unauthenticated / the config option
   * has not been set.
   *
   * @returns {UserData|null} Resolves to the user's access token if they are
   * logged in.
   */
  fetchAuthenticatedUser = jest.fn(() => this.getAuthenticatedUser());

  /**
   * A Jest mock function (jest.fn())
   *
   * Ensures a user is authenticated. It will redirect to login when not authenticated.
   *
   * @param {string} [redirectUrl=config.baseUrl] to return user after login when not
   * authenticated.
   * @returns {UserData|null} Resolves to the user's access token if they are
   * logged in.
   */
  ensureAuthenticatedUser = jest.fn((redirectUrl = this.config.baseUrl) => {
    this.fetchAuthenticatedUser();

    if (this.getAuthenticatedUser() === null) {
      // The user is not authenticated, send them to the login page.
      this.redirectToLogin(redirectUrl);
    }

    return this.getAuthenticatedUser();
  });

  /**
   * A Jest mock function (jest.fn())
   *
   * Adds the user data supplied in the `hydratedAuthenticatedUser` config option into the object
   * returned by `getAuthenticatedUser`.  This emulates the behavior of a real auth service which
   * would make a request to fetch this data prior to merging it in.
   *
   * ```
   * console.log(authenticatedUser); // Will be sparse and only contain basic information.
   * await hydrateAuthenticatedUser()
   * const authenticatedUser = getAuthenticatedUser();
   * console.log(authenticatedUser); // Will contain additional user information
   * ```
   *
   * @returns {Promise<null>}
   */
  hydrateAuthenticatedUser = jest.fn(() => {
    const user = this.getAuthenticatedUser();
    if (user !== null) {
      this.setAuthenticatedUser({ ...user, ...this.hydratedAuthenticatedUser });
    }
  });
}

export default MockAuthService;
