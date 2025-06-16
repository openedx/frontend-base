import { render } from '@testing-library/react';
import { initialize } from '../initialize';
import SiteProvider from './SiteProvider';

jest.mock('../auth', () => ({
  configureAuth: () => { },
  getAuthenticatedUser: () => null,
  fetchAuthenticatedUser: () => null,
  getAuthenticatedHttpClient: () => ({}),
  AUTHENTICATED_USER_CHANGED: 'user_changed',
}));

jest.mock('../analytics', () => ({
  configureAnalytics: () => { },
  identifyAnonymousUser: jest.fn(),
  identifyAuthenticatedUser: jest.fn(),
}));

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useTrackColorSchemeChoice: jest.fn(),
}));

describe('SiteProvider', () => {
  beforeEach(async () => {
    await initialize({
      loggingService: jest.fn(() => ({
        logError: jest.fn(),
        logInfo: jest.fn(),
      })),
      messages: {
        ar: {},
        'es-419': {},
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
        'fa-ir': {},
        fa: {},
      },
    });
  });

  it('should render its children with a router', () => {
    const component = (
      <SiteProvider>
        <div className="child">Child One</div>
        <div className="child">Child Two</div>
      </SiteProvider>
    );

    const wrapper = render(component);
    const list = wrapper.container.querySelectorAll('div.child');

    expect(list.length).toEqual(2);
    expect(list[0].textContent).toEqual('Child One');
    expect(list[1].textContent).toEqual('Child Two');
  });
});
