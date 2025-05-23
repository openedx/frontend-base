const createCsrfTokenProviderInterceptor = (options) => {
  const { csrfTokenService, csrfTokenApiPath, shouldSkip } = options;

  // Creating the interceptor inside this closure to
  // maintain reference to the options supplied.
  const interceptor = async (axiosRequestConfig) => {
    if (shouldSkip(axiosRequestConfig)) {
      return axiosRequestConfig;
    }
    const { url } = axiosRequestConfig;
    let csrfToken;

    // Important: the job of this interceptor is to get a csrf token and update
    // the original request configuration. Errors thrown getting the csrf token
    // should contain the original request config. This allows other interceptors
    // (namely our retry request interceptor below) to access the original request
    // and handle it appropriately
    try {
      csrfToken = await csrfTokenService.getCsrfToken(url, csrfTokenApiPath);
    } catch (error) {
      const requestError = Object.create(error);
      requestError.message = `[getCsrfToken] ${requestError.message}`;
      // Important: return the original axios request config
      requestError.config = axiosRequestConfig;
      return Promise.reject(requestError);
    }

    const CSRF_HEADER_NAME = 'X-CSRFToken';
    axiosRequestConfig.headers[CSRF_HEADER_NAME] = csrfToken;
    return axiosRequestConfig;
  };

  return interceptor;
};

export default createCsrfTokenProviderInterceptor;
