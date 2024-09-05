/* eslint-disable react/prop-types */
import { Context as ResponsiveContext } from 'react-responsive';
import TestRenderer from 'react-test-renderer';
// eslint-disable-next-line import/no-unresolved
import siteConfig from 'site.config';

import { AppContext, IntlProvider } from '../../runtime';

import Header from './index';

const HeaderComponent = ({ width, contextValue }) => (
  <ResponsiveContext.Provider value={width}>
    <IntlProvider locale="en" messages={{}}>
      <AppContext.Provider
        value={contextValue}
      >
        <Header />
      </AppContext.Provider>
    </IntlProvider>
  </ResponsiveContext.Provider>
);

describe('<Header />', () => {
  it('renders correctly for anonymous desktop', () => {
    const contextValue = {
      authenticatedUser: null,
      config: {
        LMS_BASE_URL: siteConfig.LMS_BASE_URL,
        SITE_NAME: siteConfig.SITE_NAME,
        LOGIN_URL: siteConfig.LOGIN_URL,
        LOGOUT_URL: siteConfig.LOGOUT_URL,
        LOGO_URL: siteConfig.LOGO_URL,
      },
    };
    const component = <HeaderComponent width={{ width: 1280 }} contextValue={contextValue} />;

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for authenticated desktop', () => {
    const contextValue = {
      authenticatedUser: {
        userId: 'abc123',
        username: 'edX',
        roles: [],
        administrator: false,
      },
      config: {
        LMS_BASE_URL: siteConfig.LMS_BASE_URL,
        SITE_NAME: siteConfig.SITE_NAME,
        LOGIN_URL: siteConfig.LOGIN_URL,
        LOGOUT_URL: siteConfig.LOGOUT_URL,
        LOGO_URL: siteConfig.LOGO_URL,
      },
    };
    const component = <HeaderComponent width={{ width: 1280 }} contextValue={contextValue} />;

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for anonymous mobile', () => {
    const contextValue = {
      authenticatedUser: null,
      config: {
        LMS_BASE_URL: siteConfig.LMS_BASE_URL,
        SITE_NAME: siteConfig.SITE_NAME,
        LOGIN_URL: siteConfig.LOGIN_URL,
        LOGOUT_URL: siteConfig.LOGOUT_URL,
        LOGO_URL: siteConfig.LOGO_URL,
      },
    };
    const component = <HeaderComponent width={{ width: 500 }} contextValue={contextValue} />;

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly for authenticated mobile', () => {
    const contextValue = {
      authenticatedUser: {
        userId: 'abc123',
        username: 'edX',
        roles: [],
        administrator: false,
      },
      config: {
        LMS_BASE_URL: siteConfig.LMS_BASE_URL,
        SITE_NAME: siteConfig.SITE_NAME,
        LOGIN_URL: siteConfig.LOGIN_URL,
        LOGOUT_URL: siteConfig.LOGOUT_URL,
        LOGO_URL: siteConfig.LOGO_URL,
      },
    };
    const component = <HeaderComponent width={{ width: 500 }} contextValue={contextValue} />;

    const wrapper = TestRenderer.create(component);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
