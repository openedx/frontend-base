import { render as rtlRender, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import siteConfig from 'site.config';
import {
  AppProvider,
  configureAuth, configureI18n, configureLogging, getConfig, IntlProvider, mergeConfig, MockAuthService
} from '../../../runtime';
import { LearningHeader as Header } from '../index';

class MockLoggingService {
  logInfo = jest.fn();

  logError = jest.fn();
}

const authenticatedUser = {
  userId: 'abc123',
  username: 'Mock User',
  roles: [],
  administrator: false,
};

function initializeMockApp() {
  mergeConfig({
    INSIGHTS_BASE_URL: siteConfig.INSIGHTS_BASE_URL || null,
    STUDIO_BASE_URL: siteConfig.STUDIO_BASE_URL || null,
    TWITTER_URL: siteConfig.TWITTER_URL || null,
    BASE_URL: siteConfig.BASE_URL || null,
    LMS_BASE_URL: siteConfig.LMS_BASE_URL || null,
    LOGIN_URL: siteConfig.LOGIN_URL || null,
    LOGOUT_URL: siteConfig.LOGOUT_URL || null,
    REFRESH_ACCESS_TOKEN_ENDPOINT: siteConfig.REFRESH_ACCESS_TOKEN_ENDPOINT || null,
    ACCESS_TOKEN_COOKIE_NAME: siteConfig.ACCESS_TOKEN_COOKIE_NAME || null,
    CSRF_TOKEN_API_PATH: siteConfig.CSRF_TOKEN_API_PATH || null,
    LOGO_URL: siteConfig.LOGO_URL || null,
    SITE_NAME: siteConfig.SITE_NAME || null,

    authenticatedUser: {
      userId: 'abc123',
      username: 'Mock User',
      roles: [],
      administrator: false,
    },
  });

  const loggingService = configureLogging(MockLoggingService, {
    config: getConfig(),
  });
  const authService = configureAuth(MockAuthService, {
    config: getConfig(),
    loggingService,
  });

  setAuthenticatedUser(authenticatedUser);

  // i18n doesn't have a service class to return.
  configureI18n({
    config: getConfig(),
    loggingService,
    messages: [{
      ar: {},
      // NOTE: 'en' is not included in this list intentionally, since it's the fallback.
      'es-419': {},
      fa: {},
      'fa-ir': {},
      fr: {},
      'zh-cn': {},
      ca: {},
      he: {},
      id: {},
      'ko-kr': {},
      pl: {},
      'pt-br': {},
      ru: {},
      th: {},
      uk: {},
    }],
  });

  return { loggingService, authService };
}

function render(
  ui,
  {
    store = null,
    ...renderOptions
  } = {},
) {
  const Wrapper = ({ children }) => (
    // eslint-disable-next-line react/jsx-filename-extension
    <IntlProvider locale="en">
      <AppProvider store={store}>
        {children}
      </AppProvider>
    </IntlProvider>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

describe('Header', () => {
  beforeAll(async () => {
    // We need to mock AuthService to implicitly use `getAuthenticatedUser` within `AppContext.Provider`.
    await initializeMockApp();
  });

  it('displays user button', () => {
    render(<Header />);
    expect(screen.getByText(authenticatedUser.username)).toBeInTheDocument();
  });

  it('displays course data', () => {
    const courseData = {
      courseOrg: 'course-org',
      courseNumber: 'course-number',
      courseTitle: 'course-title',
    };
    render(<Header {...courseData} />);

    expect(screen.getByText(`${courseData.courseOrg} ${courseData.courseNumber}`)).toBeInTheDocument();
    expect(screen.getByText(courseData.courseTitle)).toBeInTheDocument();
  });
});
