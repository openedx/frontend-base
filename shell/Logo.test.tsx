import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { getSiteConfig, mergeSiteConfig, setSiteConfig } from '../runtime/config';
import { SiteConfig } from '../types';
import Logo from './Logo';

describe('Logo component', () => {
  let originalConfig: SiteConfig;

  beforeEach(() => {
    // Shallow clone is sufficient here since we only modify headerLogoImageUrl, a top-level field.
    originalConfig = { ...getSiteConfig() };
  });

  afterEach(() => {
    setSiteConfig(originalConfig);
  });

  it('renders the image with default URL and links to / when no props are provided', async () => {
    const { getByRole } = render(<Logo />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', 'https://edx-cdn.org/v3/default/logo.svg');
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the image with provided imageUrl and links to / by default', async () => {
    const testUrl = 'https://example.com/test-logo.svg';
    const { getByRole } = render(<Logo imageUrl={testUrl} />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', testUrl);
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the image with headerLogoImageUrl when set in site config', async () => {
    const configLogoUrl = 'https://example.com/config-logo.svg';
    mergeSiteConfig({ headerLogoImageUrl: configLogoUrl });
    const { getByRole } = render(<Logo />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', configLogoUrl);
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the image wrapped in a Hyperlink when destinationUrl is provided', async () => {
    const testDestinationUrl = 'https://example.com';
    const { getByRole } = render(<Logo destinationUrl={testDestinationUrl} />);
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', testDestinationUrl);
    const image = getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://edx-cdn.org/v3/default/logo.svg');
  });
});
