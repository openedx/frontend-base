import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Logo from './Logo';

describe('Logo component', () => {
  it('renders the image with default URL when no props are provided', async () => {
    const { getByRole, queryByRole } = render(<Logo />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', 'https://edx-cdn.org/v3/default/logo.svg');
    const link = queryByRole('link');
    expect(link).toBeNull();
  });

  it('renders the image with provided imageUrl', () => {
    const testUrl = 'https://example.com/test-logo.svg';
    const { getByRole, queryByRole } = render(<Logo imageUrl={testUrl} />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', testUrl);
    const link = queryByRole('link');
    expect(link).toBeNull();
  });

  it('renders the image wrapped in a Hyperlink when destinationUrl is provided', () => {
    const testDestinationUrl = 'https://example.com';
    const { getByRole } = render(<Logo destinationUrl={testDestinationUrl} />);
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', testDestinationUrl);
    const image = getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://edx-cdn.org/v3/default/logo.svg');
  });
});
