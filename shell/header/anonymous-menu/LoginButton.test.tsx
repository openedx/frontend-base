import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { getUrlByRouteRole, useSiteConfig } from '../../../runtime';
import { IntlProvider } from '../../../runtime/i18n';
import LoginButton from './LoginButton';

jest.mock('../../../runtime', () => ({
  ...jest.requireActual('../../../runtime'),
  getUrlByRouteRole: jest.fn(),
  useSiteConfig: jest.fn(),
}));

const mockGetUrlByRouteRole = getUrlByRouteRole as jest.MockedFunction<typeof getUrlByRouteRole>;
const mockUseSiteConfig = useSiteConfig as jest.MockedFunction<typeof useSiteConfig>;

function renderLoginButton() {
  return render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <LoginButton />
      </MemoryRouter>
    </IntlProvider>
  );
}

describe('LoginButton', () => {
  beforeEach(() => {
    mockUseSiteConfig.mockReturnValue({ loginUrl: 'http://localhost:18000/login' } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('links to the route provided by an authentication app', () => {
    mockGetUrlByRouteRole.mockReturnValue('/authn/login');

    renderLoginButton();

    expect(mockGetUrlByRouteRole).toHaveBeenCalledWith('org.openedx.frontend.role.login');
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/authn/login');
  });

  it('links to an external login route when one is configured', () => {
    mockGetUrlByRouteRole.mockReturnValue('https://auth.example.com/login');

    renderLoginButton();

    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', 'https://auth.example.com/login');
  });

  it('falls back to loginUrl when no app provides the login role', () => {
    mockGetUrlByRouteRole.mockReturnValue(null);

    renderLoginButton();

    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', 'http://localhost:18000/login');
  });
});
