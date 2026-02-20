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

  it('renders the image with default URL when no imageUrl prop is provided and headerLogoImageUrl is not set in site config', async () => {
    const { getByRole, queryByRole } = render(<Logo />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', 'https://edx-cdn.org/v3/default/logo.svg');
    const link = queryByRole('link');
    expect(link).toBeNull();
  });

  it('renders the image with provided imageUrl', async () => {
    const testUrl = 'https://example.com/test-logo.svg';
    const { getByRole, queryByRole } = render(<Logo imageUrl={testUrl} />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', testUrl);
    const link = queryByRole('link');
    expect(link).toBeNull();
  });

  it('renders the image with headerLogoImageUrl when set in site config and no imageUrl prop is provided', async () => {
    const configLogoUrl = 'https://example.com/config-logo.svg';
    mergeSiteConfig({ headerLogoImageUrl: configLogoUrl });
    const { getByRole, queryByRole } = render(<Logo />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', configLogoUrl);
    const link = queryByRole('link');
    expect(link).toBeNull();
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
