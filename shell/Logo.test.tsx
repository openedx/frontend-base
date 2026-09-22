import '@testing-library/jest-dom';
import { ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { getSiteConfig, mergeSiteConfig, setSiteConfig } from '../runtime/config';
import { SiteConfig } from '../types';
import { homeRole } from './constants';
import Logo from './Logo';

function LocationDisplay() {
  const { pathname } = useLocation();
  return <div data-testid="location">{pathname}</div>;
}

function renderWithRouter(ui: ReactElement, initialEntry = '/elsewhere') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      {ui}
      <LocationDisplay />
    </MemoryRouter>
  );
}

describe('Logo component', () => {
  let originalConfig: SiteConfig;

  beforeEach(() => {
    // Shallow clone is sufficient here since we only modify top-level fields.
    originalConfig = { ...getSiteConfig() };
  });

  afterEach(() => {
    setSiteConfig(originalConfig);
  });

  it('renders the image with default URL and links to / when no props are provided', async () => {
    renderWithRouter(<Logo />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://edx-cdn.org/v3/default/logo.svg');
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the image with provided imageUrl and links to / by default', async () => {
    const testUrl = 'https://example.com/test-logo.svg';
    renderWithRouter(<Logo imageUrl={testUrl} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', testUrl);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the image with headerLogoImageUrl when set in site config', async () => {
    const configLogoUrl = 'https://example.com/config-logo.svg';
    mergeSiteConfig({ headerLogoImageUrl: configLogoUrl });
    renderWithRouter(<Logo />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', configLogoUrl);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the image wrapped in a Hyperlink when destinationUrl is provided', async () => {
    const testDestinationUrl = 'https://example.com';
    renderWithRouter(<Logo destinationUrl={testDestinationUrl} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', testDestinationUrl);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://edx-cdn.org/v3/default/logo.svg');
  });

  it('navigates to the home route in the client when an app provides one', async () => {
    mergeSiteConfig({
      apps: [{
        appId: 'org.openedx.frontend.app.logoTest',
        routes: [{ path: '/learner-dashboard/*', handle: { roles: [homeRole] } }],
      }],
    });
    renderWithRouter(<Logo />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/learner-dashboard');

    fireEvent.click(link);
    expect(screen.getByTestId('location')).toHaveTextContent('/learner-dashboard');
  });
});
