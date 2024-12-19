import axios from 'axios';
import PropTypes from 'prop-types';
import { camelCaseObject } from '../utils';
import AxiosCsrfTokenService from './AxiosCsrfTokenService';
import AxiosJwtTokenService from './AxiosJwtTokenService';
import createCsrfTokenProviderInterceptor from './interceptors/createCsrfTokenProviderInterceptor';
import createJwtTokenProviderInterceptor from './interceptors/createJwtTokenProviderInterceptor';
import createProcessAxiosRequestErrorInterceptor from './interceptors/createProcessAxiosRequestErrorInterceptor';
import configureCache from './LocalForageCache';
import { logFrontendAuthError } from './utils';

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
};

/**
 * @implements {AuthService}
 * @memberof module:Auth
 */
class AxiosJwtAuthService {
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
    this.cachedAuthenticatedHttpClient = null;
    this.cachedHttpClient = null;
    this.authenticatedUser = null;

    PropTypes.checkPropTypes(optionsPropTypes, options, 'options', 'AuthService');

    this.config = options.config;
    this.loggingService = options.loggingService;
    this.jwtTokenService = new AxiosJwtTokenService(
      this.loggingService,
      this.config.accessTokenCookieName,
      this.config.lmsBaseUrl,
      this.config.refreshAccessTokenApiPath,
    );
    this.csrfTokenService = new AxiosCsrfTokenService(this.config.csrfTokenApiPath);
    this.authenticatedHttpClient = this.addAuthenticationToHttpClient(axios.create());
    this.httpClient = axios.create();
    configureCache()
      .then((cachedAxiosClient) => {
        this.cachedAuthenticatedHttpClient = this.addAuthenticationToHttpClient(cachedAxiosClient);
        this.cachedHttpClient = cachedAxiosClient;
      })
      .catch((e) => {
        // fallback to non-cached HTTP clients and log error
        this.cachedAuthenticatedHttpClient = this.authenticatedHttpClient;
        this.cachedHttpClient = this.httpClient;
        logFrontendAuthError(this.loggingService, `configureCache failed with error: ${e.message}`);
      }).finally(() => {
        this.middleware = options.middleware;
        this.applyMiddleware(options.middleware);
      });
  }

  /**
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
      logFrontendAuthError(this.loggingService, error);
      throw error;
    }
  }

  /**
   * Gets the authenticated HTTP client for the service.  This is an axios instance.
   *
   * @param {Object} [options] Optional options for how the HTTP client should be configured.
   * @param {boolean} [options.useCache] Whether to use front end caching for all requests made
   * with the returned client.
   *
   * @returns {HttpClient} A configured axios http client which can be used for authenticated
   * requests.
   */
  getAuthenticatedHttpClient(options = {}) {
    if (options.useCache) {
      return this.cachedAuthenticatedHttpClient;
    }

    return this.authenticatedHttpClient;
  }

  /**
   * Gets the unauthenticated HTTP client for the service.  This is an axios instance.
   *
   * @param {Object} [options] Optional options for how the HTTP client should be configured.
   * @param {boolean} [options.useCache] Whether to use front end caching for all requests made
   * with the returned client.
   * @returns {HttpClient} A configured axios http client.
   */
  getHttpClient(options = {}) {
    if (options.useCache) {
      return this.cachedHttpClient;
    }

    return this.httpClient;
  }

  /**
   * Used primarily for testing.
   *
   * @ignore
   */
  getJwtTokenService() {
    return this.jwtTokenService;
  }

  /**
   * Used primarily for testing.
   *
   * @ignore
   */
  getCsrfTokenService() {
    return this.csrfTokenService;
  }

  /**
   * Builds a URL to the login page with a post-login redirect URL attached as a query parameter.
   *
   * ```
   * const url = getLoginRedirectUrl('http://localhost/mypage');
   * console.log(url); // http://localhost/login?next=http%3A%2F%2Flocalhost%2Fmypage
   * ```
   *
   * @param {string} redirectUrl The URL the user should be redirected to after logging in.
   */
  getLoginRedirectUrl(redirectUrl = this.config.baseUrl) {
    return `${this.config.loginUrl}?next=${encodeURIComponent(redirectUrl)}`;
  }

  /**
   * Redirects the user to the login page.
   *
   * @param {string} redirectUrl The URL the user should be redirected to after logging in.
   */
  redirectToLogin(redirectUrl = this.config.baseUrl) {
    global.location.assign(this.getLoginRedirectUrl(redirectUrl));
  }

  /**
   * Builds a URL to the logout page with a post-logout redirect URL attached as a query parameter.
   *
   * ```
   * const url = getLogoutRedirectUrl('http://localhost/mypage');
   * console.log(url); // http://localhost/logout?next=http%3A%2F%2Flocalhost%2Fmypage
   * ```
   *
   * @param {string} redirectUrl The URL the user should be redirected to after logging out.
   */
  getLogoutRedirectUrl(redirectUrl = this.config.baseUrl) {
    return `${this.config.logoutUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  }

  /**
   * Redirects the user to the logout page.
   *
   * @param {string} redirectUrl The URL the user should be redirected to after logging out.
   */
  redirectToLogout(redirectUrl = this.config.baseUrl) {
    global.location.assign(this.getLogoutRedirectUrl(redirectUrl));
  }

  /**
   * If it exists, returns the user data representing the currently authenticated user. If the
   * user is anonymous, returns null.
   *
   * @returns {UserData|null}
   */
  getAuthenticatedUser() {
    return this.authenticatedUser;
  }

  /**
   * Sets the authenticated user to the provided value.
   *
   * @param {UserData} authUser
   */
  setAuthenticatedUser(authUser) {
    this.authenticatedUser = authUser;
  }

  /**
   * Reads the authenticated user's access token. Resolves to null if the user is
   * unauthenticated.
   *
   * @returns {Promise<UserData>|Promise<null>} Resolves to the user's access token if they are
   * logged in.
   */
  async fetchAuthenticatedUser(options = {}) {
    const decodedAccessToken = await this.jwtTokenService.getJwtToken(options.forceRefresh || false);

    if (decodedAccessToken !== null) {
      this.setAuthenticatedUser({
        email: decodedAccessToken.email,
        userId: decodedAccessToken.user_id,
        username: decodedAccessToken.preferred_username,
        roles: decodedAccessToken.roles || [],
        administrator: decodedAccessToken.administrator,
        name: decodedAccessToken.name,
      });
      // Sets userId as a custom attribute that will be included with all subsequent log messages.
      // Very helpful for debugging.
      this.loggingService.setCustomAttribute('userId', decodedAccessToken.user_id);
    } else {
      this.setAuthenticatedUser(null);
      // Intentionally not setting `userId` in the logging service here because it would be useful
      // to know the previously logged in user for debugging refresh issues.
    }

    return this.getAuthenticatedUser();
  }

  /**
   * Ensures a user is authenticated. It will redirect to login when not
   * authenticated.
   *
   * @param {string} [redirectUrl=config.baseUrl] to return user after login when not
   * authenticated.
   * @returns {Promise<UserData>}
   */
  async ensureAuthenticatedUser(redirectUrl = this.config.baseUrl) {
    await this.fetchAuthenticatedUser();

    if (this.getAuthenticatedUser() === null) {
      const isRedirectFromLoginPage = global.document.referrer?.startsWith(this.config.loginUrl);

      if (isRedirectFromLoginPage) {
        const redirectLoopError = new Error('Redirect from login page. Rejecting to avoid infinite redirect loop.');
        logFrontendAuthError(this.loggingService, redirectLoopError);
        throw redirectLoopError;
      }

      // The user is not authenticated, send them to the login page.
      this.redirectToLogin(redirectUrl);

      const unauthorizedError = new Error('Failed to ensure the user is authenticated');
      unauthorizedError.isRedirecting = true;
      throw unauthorizedError;
    }

    return this.getAuthenticatedUser();
  }

  /**
   * Fetches additional user account information for the authenticated user and merges it into the
   * existing authenticatedUser object, available via getAuthenticatedUser().
   *
   * ```
   *  console.log(authenticatedUser); // Will be sparse and only contain basic information.
   *  await hydrateAuthenticatedUser()
   *  const authenticatedUser = getAuthenticatedUser();
   *  console.log(authenticatedUser); // Will contain additional user information
   * ```
   *
   * @returns {Promise<null>}
   */
  async hydrateAuthenticatedUser() {
    const user = this.getAuthenticatedUser();
    if (user !== null) {
      const response = await this.authenticatedHttpClient
        .get(`${this.config.lmsBaseUrl}/api/user/v1/accounts/${user.username}`);
      this.setAuthenticatedUser({ ...user, ...camelCaseObject(response.data) });
    }
  }

  /**
 * Adds authentication defaults and interceptors to an HTTP client instance.
 *
 * @param {HttpClient} newHttpClient
 * @param {Object} config
 * @param {string} [config.refreshAccessTokenApiPath]
 * @param {string} [config.accessTokenCookieName]
 * @param {string} [config.csrfTokenApiPath]
 * @returns {HttpClient} A configured Axios HTTP client.
 */
  addAuthenticationToHttpClient(newHttpClient) {
    const httpClient = Object.create(newHttpClient);
    // Set withCredentials to true. Enables cross-site Access-Control requests
    // to be made using cookies, authorization headers or TLS client
    // certificates. More on MDN:
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    httpClient.defaults.withCredentials = true;

    // Axios interceptors

    // The JWT access token interceptor attempts to refresh the user's jwt token
    // before any request unless the isPublic flag is set on the request config.
    const refreshAccessTokenInterceptor = createJwtTokenProviderInterceptor({
      jwtTokenService: this.jwtTokenService,
      shouldSkip: axiosRequestConfig => axiosRequestConfig.isPublic,
    });
    // The CSRF token intercepter fetches and caches a csrf token for any post,
    // put, patch, or delete request. That token is then added to the request
    // headers.
    const attachCsrfTokenInterceptor = createCsrfTokenProviderInterceptor({
      csrfTokenService: this.csrfTokenService,
      csrfTokenApiPath: this.config.csrfTokenApiPath,
      shouldSkip: (axiosRequestConfig) => {
        const { method, isCsrfExempt } = axiosRequestConfig;
        const CSRF_PROTECTED_METHODS = ['post', 'put', 'patch', 'delete'];
        return isCsrfExempt || !CSRF_PROTECTED_METHODS.includes(method);
      },
    });

    const processAxiosRequestErrorInterceptor = createProcessAxiosRequestErrorInterceptor({
      loggingService: this.loggingService,
    });

    // Request interceptors: Axios runs the interceptors in reverse order from
    // how they are listed. After fetching csrf tokens no longer require jwt
    // authentication, it won't matter which happens first. This change is
    // coming soon in edx-platform. Nov. 2019
    httpClient.interceptors.request.use(attachCsrfTokenInterceptor);
    httpClient.interceptors.request.use(refreshAccessTokenInterceptor);

    // Response interceptor: moves axios response error data into the error
    // object at error.customAttributes
    httpClient.interceptors.response.use(
      response => response,
      processAxiosRequestErrorInterceptor,
    );

    return httpClient;
  }
}

export default AxiosJwtAuthService;
