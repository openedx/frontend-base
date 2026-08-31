import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { getUrlByRouteRole, useSiteConfig } from '../../../runtime';
import { IntlProvider } from '../../../runtime/i18n';
import RegisterButton from './RegisterButton';

jest.mock('../../../runtime', () => ({
  ...jest.requireActual('../../../runtime'),
  getUrlByRouteRole: jest.fn(),
  useSiteConfig: jest.fn(),
}));

const mockGetUrlByRouteRole = getUrlByRouteRole as jest.MockedFunction<typeof getUrlByRouteRole>;
const mockUseSiteConfig = useSiteConfig as jest.MockedFunction<typeof useSiteConfig>;

function renderRegisterButton() {
  return render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <RegisterButton />
      </MemoryRouter>
    </IntlProvider>
  );
}

describe('RegisterButton', () => {
  beforeEach(() => {
    mockUseSiteConfig.mockReturnValue({ lmsBaseUrl: 'http://localhost:18000' } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('links to the route provided by an authentication app', () => {
    mockGetUrlByRouteRole.mockReturnValue('/authn/register');

    renderRegisterButton();

    expect(mockGetUrlByRouteRole).toHaveBeenCalledWith('org.openedx.frontend.role.register');
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/authn/register');
  });

  it('falls back to the LMS registration page when no app provides the register role', () => {
    mockGetUrlByRouteRole.mockReturnValue(null);

    renderRegisterButton();

    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', 'http://localhost:18000/register');
  });
});
